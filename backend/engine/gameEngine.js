import { GameState } from './gameState.js';
import { Player } from '../../common/representations/player.mjs';
import { LocationConstants, CardLocations, LocationCard } from '../../common/representations/location.mjs';
import { CardCharacters, CharacterConstants, CharacterPiece, CharacterCard } from  '../../common/representations/character.mjs';
import { CardWeapons, WeaponPiece, WeaponCard } from '../../common/representations/weapon.mjs';
import {
	emitGameCannotStart,
	emitPlayerStartInfo,
	emitGameState,
	emitRequestMove,
	emitRequestSuggestion,
	emitRequestProof,
	emitIsProofProvided,
	emitProofProvided,
	emitAccusationCorrect
} from '../interactions/socketEmits.js';
import { Suggestion } from '../../common/representations/suggestion.mjs';

export class GameEngine
{
    constructor(gameId)
	{
		this.gameId = gameId;

		// Pieces are objects that have locations. Location properties of these pieces will be changed throughout the game.
		this.totalCharacterPieces = this.initializeCharacterPieces();
		this.totalWeaponPieces = this.initializeWeaponPieces();

		// Cards are objects that can be set aside for mystery cards and also distributed across players. Cards do not hold locations.
		this.totalCharacterCards = this.initializeCharacterCards();
		this.totalWeaponCards = this.initializeWeaponCards();
		this.totalLocationCards = this.initializeLocationCards();

		this.mysteryCards = [];
		this.userFacingCards = [];

		this.players = [];
		this.currentPlayerIndex = 0;
		this.proofRequestingOffset = 1;

		this.gameState = GameState.INITIATING;
	}

	initializeCharacterPieces()
	{
		// Provide starting locations on initialization of character cards.
		var scarlet = new CharacterPiece(CharacterConstants.SCARLET, LocationConstants.Start.HALL_LOUNGE_HOME);
		var plum = new CharacterPiece(CharacterConstants.PLUM, LocationConstants.Start.LIBRARY_STUDY_HOME);
		var peacock = new CharacterPiece(CharacterConstants.PEACOCK, LocationConstants.Start.CONSERVATORY_LIBRARY_HOME);
		var green = new CharacterPiece(CharacterConstants.GREEN, LocationConstants.Start.BALLROOM_CONSERVATORY_HOME);
		var white = new CharacterPiece(CharacterConstants.WHITE, LocationConstants.Start.KITCHEN_BALLROOM_HOME);
		var mustard = new CharacterPiece(CharacterConstants.MUSTARD, LocationConstants.Start.LOUNGE_DININGROOM_HOME);
		return [scarlet, plum, peacock, green, white, mustard];
	}

	initializeWeaponPieces()
	{
		let weaponPieces = [];
		CardWeapons.forEach(weaponConstant => weaponPieces.push(new WeaponPiece(weaponConstant, LocationConstants.None)));
		return weaponPieces;
	}

	initializeCharacterCards()
	{
		let characterCards = [];
		CardCharacters.forEach(characterConstant => characterCards.push(new CharacterCard(characterConstant)));
		return characterCards;
	}

	initializeWeaponCards()
	{
		let weaponCards = [];
		CardWeapons.forEach(weaponConstant => weaponCards.push(new WeaponCard(weaponConstant)));
		return weaponCards;
	}

	initializeLocationCards()
	{
		let locationCards = [];
		CardLocations.forEach(locationConstant => locationCards.push(new LocationCard(locationConstant)));
		return locationCards;
	}

	getPlayerCount()
	{
		return this.players.length;
	}

	addPlayer(playerId)
	{
		this.players.push(new Player(playerId));
	}

	chooseMysteryCardIndexFromSelection(cards)
	{
		// Hardcoded mystery cards for initial increments.
		return 0;
	}

	allocateCards()
	{
		// Set aside mystery cards before distributing cards.
		let characterMysteryCardIndex = this.chooseMysteryCardIndexFromSelection(this.totalCharacterCards);
		let weaponMysteryCardIndex = this.chooseMysteryCardIndexFromSelection(this.totalWeaponCards);
		let locationMysteryCardIndex = this.chooseMysteryCardIndexFromSelection(this.totalLocationCards);

		this.mysteryCards = [
			this.totalCharacterCards[characterMysteryCardIndex],
			this.totalWeaponCards[weaponMysteryCardIndex],
			this.totalLocationCards[locationMysteryCardIndex]
		];
		console.log('\nMystery cards:');
		console.log(this.mysteryCards);

		let availableCharacterCards = JSON.parse(JSON.stringify(this.totalCharacterCards));
		availableCharacterCards.splice(characterMysteryCardIndex, 1);
		let availableWeaponCards = JSON.parse(JSON.stringify(this.totalWeaponCards));
		availableWeaponCards.splice(weaponMysteryCardIndex, 1);
		let availableLocationCards = JSON.parse(JSON.stringify(this.totalLocationCards));
		availableLocationCards.splice(locationMysteryCardIndex, 1);

		this.userFacingCards = availableCharacterCards.concat(availableWeaponCards).concat(availableLocationCards);
	}

	setupPlayers()
	{
		// Allocate the mystery cards and available cards for player distribution.
		this.allocateCards();

		let generalCardCount = Math.floor(this.userFacingCards.length / this.getPlayerCount());
		for (let i = 0; i < this.getPlayerCount(); i++)
		{
			// Player will refer to one of the character pieces.
			// Character piece stores the location.
			let currPlayer = this.players[i];
			currPlayer.character = this.totalCharacterPieces[i];

			let currPlayerCardCount = Math.min(generalCardCount, this.userFacingCards.length);
			let playerCards = this.userFacingCards.slice(i * generalCardCount, i * generalCardCount + currPlayerCardCount);
			currPlayer.cards = playerCards;

			console.log('\nPlayer:');
			console.log(currPlayer);

			emitPlayerStartInfo(this.gameId, currPlayer);
		}
	}

	startGame()
	{
		// For initial increment, player count for game will be 3.
		if (this.getPlayerCount() != 3)
		{
			emitGameCannotStart(this.gameId);
		}
		else
		{
			this.setupPlayers();
			this.emitCurrentGameState();

			// Everything has been setup and initialized, so start the game sequence.
			this.requestMove();
		}
	}

	/* Overall sequence for player turn:
	- STATE = REQUESTING_MOVE
	- Emit request for current player move
	- STATE = REQUESTED_MOVE
	- Listen on player move being sent from frontend
	- STATE = PROCESSING_MOVE
	- Process the move sent from frontend by updating game state
	- Notify all users of new game state
	- STATE = PROCESSED_MOVE
	- STATE = REQUESTING_SUGGESTION
	- Emit request for current player suggestion
	- STATE = REQUESTED_SUGGESTION
	- Listen on player suggestion begin sent from frontend
	- STATE = PROCESSING_SUGGESTION
	- Process the suggestion made from frontend by updating game state
	- Notify all users of new game state
	- STATE = PROCESSED_SUGGESTION
	- STATE = REQUESTING_PROOF
	- Emit request for next player proof
	- STATE = REQUESTED_PROOF
	- Listen on next player providing proof from frontend
	- STATE = PROCESSING_PROOF
	- If proof not empty, emit proof to current player.
	- If proof empty, then loop back to REQUESTING_PROOF and ask next player for proof.
	- STATE = PROCESSED_PROOF
	- Loop back to STATE = REQUESTING_MOVE
	- TODO: ACCUSATIONS (next increment)
	*/

	requestMove()
	{
		this.gameState = GameState.REQUESTING_MOVE;
		
		let potentialMoves = [];
		if (this.players[this.currentPlayerIndex].character.priorLocation == LocationConstants.None)
		{
			// First move for player's character must be to the hallway.
			potentialMoves.push(this.players[this.currentPlayerIndex].character.currentLocation.slice(0, -5));
		}
		else if (this.players[this.currentPlayerIndex].character.currentLocation in LocationConstants.Room)
		{
			// STOP GAME HERE FOR SKELETAL INCREMENT.
			console.log('Current location is a room, stopping game here for skeletal increment.');
			return;
		}
		else if (this.players[this.currentPlayerIndex].character.currentLocation in LocationConstants.Hallway)
		{
			let adjRooms = this.players[this.currentPlayerIndex].character.currentLocation.split("_");
			potentialMoves = potentialMoves.concat(adjRooms);
		}
		
		emitRequestMove(this.gameId, this.players[this.currentPlayerIndex], potentialMoves);
		this.gameState = GameState.REQUESTED_MOVE;
	}

	processMove(playerId, newCharacterLocation)
	{
		if (this.gameState == GameState.REQUESTED_MOVE && playerId == this.players[this.currentPlayerIndex].playerId)
		{
			console.log(`MOVE: ${this.players[this.currentPlayerIndex].character.name} from ${this.players[this.currentPlayerIndex].character.currentLocation} to ${newCharacterLocation}`)
			this.gameState = GameState.PROCESSING_MOVE;
			this.movePiece(this.players[this.currentPlayerIndex].character, newCharacterLocation);
			this.emitCurrentGameState();

			this.gameState = GameState.PROCESSED_MOVE;

			if (newCharacterLocation in LocationConstants.Room)
			{
				this.requestSuggestion();
			}
			else
			{
				this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.getPlayerCount();
				this.requestMove();
			}
		}
		else 
		{
			console.error(`Move has come from invalid player ${playerId}, so not processing the move.`);
		}
	}

	requestSuggestion()
	{
		this.gameState = GameState.REQUESTING_SUGGESTION;
		emitRequestSuggestion(this.gameId, this.players[this.currentPlayerIndex]);
		this.gameState = GameState.REQUESTED_SUGGESTION;
	}

	processSuggestion(playerId, suggestedCharacterName, suggestedWeaponName)
	{
		if (this.gameState == GameState.REQUESTED_SUGGESTION && playerId == this.players[this.currentPlayerIndex].playerId)
		{
			console.log(`SUGGESTION: ${suggestedCharacterName} to ${this.players[this.currentPlayerIndex].character.currentLocation} with ${suggestedWeaponName}.`);
			this.gameState = GameState.PROCESSING_SUGGESTION;
			this.movePiece(this.getCharacterPieceByCharacterName(suggestedCharacterName), this.players[this.currentPlayerIndex].character.currentLocation);
			this.movePiece(this.getWeaponPieceByWeaponName(suggestedWeaponName), this.players[this.currentPlayerIndex].character.currentLocation);
			let processedSuggestion = new Suggestion(this.players[this.currentPlayerIndex].character.currentLocation, suggestedCharacterName, suggestedWeaponName);
			this.emitCurrentGameState();

			this.gameState = GameState.PROCESSED_SUGGESTION;
			this.requestProof(processedSuggestion);
		}
		else 
		{
			console.error(`Suggestion has come from invalid player ${playerId}, so not processing the suggestion.`);
		}
	}

	requestProof(processedSuggestion)
	{
		this.gameState = GameState.REQUESTING_PROOF;
		emitRequestProof(this.gameId, this.players[(this.currentPlayerIndex + this.proofRequestingOffset) % this.getPlayerCount()], processedSuggestion);
		this.gameState = GameState.REQUESTED_PROOF;
	}

	processProof(proofProvidingPlayerId, proofCard)
	{
		if (this.gameState == GameState.REQUESTED_PROOF && proofProvidingPlayerId == this.players[(this.currentPlayerIndex + this.proofRequestingOffset) % this.getPlayerCount()].playerId)
		{
			this.gameState = GameState.PROCESSING_PROOF;

			emitIsProofProvided(this.gameId, proofCard !== undefined, proofProvidingPlayerId);
			emitProofProvided(this.gameId, this.players[this.currentPlayerIndex], proofCard);

			if (proofCard == undefined)
			{
				// Move onto next player or gathering proof.
				this.proofRequestingOffset += 1;
				if ((this.currentPlayerIndex + this.proofRequestingOffset) % this.getPlayerCount() != this.currentPlayerIndex)
				{
					this.requestProof();
					return;
				}
			}

			this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.getPlayerCount();
			this.gameState = GameState.PROCESSED_PROOF;
			this.requestMove();
		}
		else 
		{
			console.error(`Proof has come from invalid player ${playerId}, so not processing the proof.`);
		}
	}

	processAccusation(playerId, accusingCharacter, accusingWeapon, accusingLocation)
	{
		if (playerId == this.players[this.currentPlayerIndex].playerId)
		{
			if (this.mysteryCards[0].name == accusingCharacter && this.mysteryCards[1].name == accusingWeapon && this.mysteryCards[2].name == accusingLocation)
			{
				console.log(`ACCUSATION: ${accusingCharacter} in ${accusingLocation} with ${accusingWeapon}`);
				emitAccusationCorrect(this.gameId, this.players[this.currentPlayerIndex], accusingCharacter, accusingWeapon, accusingLocation);
			}
		}
		else
		{
			console.error(`Accusation has come from invalid player ${playerId}, so not processing the proof.`);
		}
	}

	emitCurrentGameState()
	{
		emitGameState(this.gameId, this.totalCharacterPieces, this.totalWeaponPieces);		
	}

	movePiece(gamePiece, newLocation)
	{
		gamePiece.priorLocation = gamePiece.currentLocation;
		gamePiece.currentLocation = newLocation;
	}

	getCharacterPieceByCharacterName(characterName)
	{
		return this.totalCharacterPieces.find(characterPiece => characterPiece.name == characterName);
	}

	getWeaponPieceByWeaponName(weaponName)
	{
		return this.totalWeaponPieces.find(weaponPiece => weaponPiece.name == weaponName);
	}

	printGameState()
	{
		console.log(JSON.stringify(this, null, 4));
	}
}