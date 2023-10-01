import { GameState } from './gameState.js';
import { Player } from '../../common/representations/player.mjs';
import { LocationConstants, CardLocations, LocationCard } from '../../common/representations/location.mjs';
import { CardCharacters, CharacterConstants, CharacterPiece, CharacterCard } from  '../../common/representations/character.mjs';
import { CardWeapons, WeaponPiece, WeaponCard } from '../../common/representations/weapon.mjs';
import { emitGameCannotStart, emitPlayerStartInfo, emitGameState, emitRequestMove } from '../interactions/socketEmits.js';

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
		console.log('\nUser facing cards:');
		console.log(this.userFacingCards);
	}

	setupPlayers()
	{
		// Allocate the mystery cards and available cards for player distribution.
		this.allocateCards();

		let generalCardCount = Math.floor(this.userFacingCards.length / this.getPlayerCount());
		for (let i = 0; i < this.getPlayerCount(); i++)
		{
			// Player will refer to one of the character pieces.
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
			emitGameState(this.gameId, this.totalCharacterPieces, this.totalWeaponPieces);
			this.gameOn = true;

			// Everything has been setup and initialized, so start the game sequence.
			this.requestMove();
		}
	}

	/* Overall sequence for player turn:
	- STATE = REQUESTING_MOVE
	- Emit request for current player move
	- STATE = REQUESTED_MOVE
	- Listen on player move being sent from frontend
	- State = PROCESSING_MOVE
	- Process the move sent from frontend
	- STATE = PROCESSED_MOVE
	- TODO: SUGGESTIONS/ACCUSATIONS
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
		
		emitRequestMove(this.gameId, this.players[this.currentPlayerIndex], potentialMoves);
		this.gameState = GameState.REQUESTED_MOVE;
	}

	processMove(playerId, requestedUpdatedCharacterPiece)
	{
		if (this.gameState == GameState.REQUESTED_MOVE && playerId == this.players[this.currentPlayerIndex].playerId)
		{
			this.gameState = GameState.PROCESSING_MOVE;
			this.players[this.currentPlayerIndex].character.location = requestedUpdatedCharacterPiece.location;
			emitGameState(this.gameId, this.totalCharacterPieces, this.totalWeaponPieces);		
			this.gameState = GameState.PROCESSED_MOVE;
		}
	}

	printGameState()
	{
		console.log(JSON.stringify(this, null, 4));
	}
}