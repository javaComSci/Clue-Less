import { GameState } from './gameState.js';
import { Player } from '../../common/representations/player.mjs';
import { LocationConstants, getAvailableHallwaysForMoving, getAvailableDiagonalRoomsForMoving, getStayMove, STAY, CANNOTMOVE } from '../../common/representations/location.mjs';
import {
	emitGameCannotStart,
	emitPlayerStartInfo,
	emitGameState,
	emitRequestMove,
	emitRequestSuggestion,
	emitSuggestionWasProvided,
	emitRequestProof,
	emitIsProofProvided,
	emitProofProvided,
	emitRequestPlayerTurnCompleteConfirmation,
	emitAccusationCorrect,
	emitAccusationIncorrect
} from '../interactions/socketEmits.js';
import { Suggestion } from '../../common/representations/suggestion.mjs';
import { GameCard } from '../../common/representations/gameCard.mjs';
import {
	shuffleInPlace,
	createWeaponPieces,
	createCharacterPieces,
	createCharacterCards,
	createWeaponCards,
	createLocationCards,
	getCharacterPieceByCharacterName,
	getWeaponPieceByWeaponName
} from './helper.js';

export class GameEngine {
	/* Overall sequence for player turn:
	- STATE = REQUESTING_MOVE
	- Emit REQUESTING_MOVE_BROADCAST
	- Emit REQUEST_MOVE
	- STATE = REQUESTED_MOVE
	- Listen on move
	- STATE = PROCESSING_MOVE
	- Emit GAME_STATE
	- STATE = PROCESSED_MOVE

	// PLAYER CAN SUGGEST:
	- STATE = REQUESTING_SUGGESTION
	- Emit REQUEST_SUGGESTION
	- STATE = REQUESTED_SUGGESTION
	- Listen on suggest
	- STATE = PROCESSING_SUGGESTION
	- Emit GAME_STATE
	- STATE = PROCESSED_SUGGESTION
	- STATE = REQUESTING_PROOF
	- Emit REQUESTING_PROOF_BROADCAST
	- Emit REQUEST_PROOF
	- STATE = REQUESTED_PROOF
	- Listen on proof
	- STATE = PROCESSING_PROOF
	- Emit IS_PROOF_PROVIDED
	- Emit PROOF_PROVIDED
	- If proof not provided and there are remaining players: STATE = REQUESTED_PROOF and loop back
	- Else: emit REQUEST_TURN_COMPLETE_CONFIRM

	// PLAYER CANNOT SUGGEST:
	- emit REQUEST_TURN_COMPLETE_CONFIRM

	// Player decides to accuse (can be done if state = REQUESTING_MOVE, REQUESTING_SUGGESTION)
	- STATE = PROCESSED_ACCUSATION
	- If correct, emit ACCUSATION_CORRECT
	- Else, emit ACCUSATION_INCORRECT and REQUEST_TURN_COMPLETE_CONFIRM
	*/

	constructor(gameId) {
		this.gameId = gameId;

		// Pieces are objects that have locations. Location properties of these pieces will be changed throughout the game.
		this.totalCharacterPieces = createCharacterPieces();
		this.totalWeaponPieces = createWeaponPieces();

		// Cards are objects that can be set aside for mystery cards and also distributed across players. Cards do not hold locations.
		this.totalCharacterCards = createCharacterCards();
		this.totalWeaponCards = createWeaponCards();
		this.totalLocationCards = createLocationCards();

		this.mysteryCards = [];
		this.userFacingCards = [];

		this.players = [];
		this.currentPlayerIndex = 0;
		this.proofRequestingOffset = 1;

		this.setGameState(GameState.INITIATING);
	}

	getPlayerCount() {
		return this.players.length;
	}

	addPlayer(playerId) {
		this.players.push(new Player(playerId));
	}

	getCurrentPlayer() {
		return this.players[this.currentPlayerIndex];
	}

	allocateCards() {
		// Set aside mystery cards before distributing cards.
		let characterMysteryCardIndex = GameCard.chooseMysteryCardIndexFromSelection(this.totalCharacterCards)
		let weaponMysteryCardIndex = GameCard.chooseMysteryCardIndexFromSelection(this.totalWeaponCards);
		let locationMysteryCardIndex = GameCard.chooseMysteryCardIndexFromSelection(this.totalLocationCards);

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

		// Shuffle the remaining cards among players.
		this.userFacingCards = availableCharacterCards.concat(availableWeaponCards).concat(availableLocationCards);
		console.log('\nTotal user facing cards:');
		console.log(this.userFacingCards);
		shuffleInPlace(this.userFacingCards);
	}

	setupPlayers() {
		this.allocateCards();

		let generalCardCount = Math.floor(this.userFacingCards.length / this.getPlayerCount());
		for (let i = 0; i < this.getPlayerCount(); i++) {
			let currPlayer = this.players[i];
			currPlayer.character = this.totalCharacterPieces[i];

			let currPlayerCardCount = Math.min(generalCardCount, this.userFacingCards.length);
			let playerCards = this.userFacingCards.slice(i * generalCardCount, i * generalCardCount + currPlayerCardCount);
			currPlayer.cards = playerCards;

			console.log('\nPlayer:');
			console.log(currPlayer);

			emitPlayerStartInfo(this.gameId, currPlayer);
		}
		console.log("");
	}

	startGame() {
		this.setupPlayers();
		this.emitCurrentGameState();

		// Everything has been setup and initialized, so start the game sequence.
		this.requestMove();
	}

	requestTurnCompletion()
	{
		emitRequestPlayerTurnCompleteConfirmation(this.gameId, this.getCurrentPlayer());
	}

	processTurnCompletion(playerId)
	{
		// A turn can said to be completed after move, after proof processed, or after accusation processed.
		if ((this.gameState == GameState.PROCESSED_MOVE || this.gameState == GameState.PROCESSED_PROOF || this.gameState == GameState.PROCESSED_ACCUSATION) 
			&& this.getCurrentPlayer().playerId == playerId) {
			
			for (let i = 1; i < this.getPlayerCount(); i++)
			{
				let consideringPlayerIndex = (this.currentPlayerIndex + i) % this.getPlayerCount();
				if (this.players[consideringPlayerIndex].canPlay) {
					this.currentPlayerIndex = consideringPlayerIndex;
					break;
				}
			}

			this.requestMove();
		}
		else {
			console.error(`Turn completion has come from invalid player ${playerId} or during invalid state of ${this.gameState}, so not processing the turn completion.`);
		}
	}

	requestMove() {
		this.setGameState(GameState.REQUESTING_MOVE);

		let potentialMoves = [];
		if (this.getCurrentPlayer().character.priorLocation == LocationConstants.None) {
			// First move for player's character must be to the hallway.
			potentialMoves.push(this.getCurrentPlayer().character.currentLocation.slice(0, -5));
		}
		else if (this.getCurrentPlayer().character.currentLocation in LocationConstants.Room) {
			// Can move to adjacent hallways if no character is already there.
			potentialMoves = potentialMoves.concat(getAvailableHallwaysForMoving(this.getCurrentPlayer().character.currentLocation, this.totalCharacterPieces));

			// Can move to diagonal rooms through secret passageway.
			potentialMoves = potentialMoves.concat(getAvailableDiagonalRoomsForMoving(this.getCurrentPlayer().character.currentLocation));

			// Don't move at all because was moved to place by another player.
			potentialMoves = potentialMoves.concat(getStayMove(this.getCurrentPlayer().character, this.getCurrentPlayer().playerId));

			// If in room blocked in all hallways with no way to move, then tell UI CANNOTMOVE.
			if (potentialMoves.length == 0) {
				potentialMoves = [CANNOTMOVE];
			}
		}
		else if (this.getCurrentPlayer().character.currentLocation in LocationConstants.Hallway) {
			let adjRooms = this.getCurrentPlayer().character.currentLocation.split("_");
			potentialMoves = potentialMoves.concat(adjRooms);
		}

		emitRequestMove(this.gameId, this.getCurrentPlayer(), potentialMoves);
		this.setGameState(GameState.REQUESTED_MOVE);
	}

	processMove(playerId, newCharacterLocation) {
		if (this.gameState == GameState.REQUESTED_MOVE && playerId == this.getCurrentPlayer().playerId) {
			console.log(`MOVE: ${this.getCurrentPlayer().character.name} from ${this.getCurrentPlayer().character.currentLocation} to ${newCharacterLocation}.`)
			this.setGameState(GameState.PROCESSING_MOVE);
			
			if (newCharacterLocation != CANNOTMOVE) {
				this.getCurrentPlayer().character.movePiece(newCharacterLocation, playerId);
			}

			this.emitCurrentGameState();
			this.setGameState(GameState.PROCESSED_MOVE);

			if (newCharacterLocation in LocationConstants.Room && newCharacterLocation != CANNOTMOVE) {
				this.requestSuggestion();
			}
			else {
				this.requestTurnCompletion();
			}
		}
		else {
			console.error(`Move has come from invalid player ${playerId} or during invalid state of ${this.gameState}, so not processing the move.`);
		}
	}

	requestSuggestion() {
		this.setGameState(GameState.REQUESTING_SUGGESTION);
		emitRequestSuggestion(this.gameId, this.getCurrentPlayer());
		this.setGameState(GameState.REQUESTED_SUGGESTION);
	}

	processSuggestion(playerId, suggestedCharacterName, suggestedWeaponName) {
		if (this.gameState == GameState.REQUESTED_SUGGESTION && playerId == this.getCurrentPlayer().playerId) {
			console.log(`SUGGESTION: ${suggestedCharacterName} to ${this.getCurrentPlayer().character.currentLocation} with ${suggestedWeaponName}.`);
			this.setGameState(GameState.PROCESSING_SUGGESTION);

			emitSuggestionWasProvided(this.gameId, this.getCurrentPlayer());
			getCharacterPieceByCharacterName(this.totalCharacterPieces, suggestedCharacterName).movePiece(this.getCurrentPlayer().character.currentLocation, this.getCurrentPlayer().playerId);
			getWeaponPieceByWeaponName(this.totalWeaponPieces, suggestedWeaponName).movePiece(this.getCurrentPlayer().character.currentLocation, this.getCurrentPlayer().playerId);

			let suggestion = new Suggestion(this.getCurrentPlayer().character.currentLocation, suggestedCharacterName, suggestedWeaponName);
			this.emitCurrentGameState();

			this.setGameState(GameState.PROCESSED_SUGGESTION);
			this.processingSuggestion = suggestion;
			this.requestProof();
		}
		else {
			console.error(`Suggestion has come from invalid player ${playerId} or during invalid state of ${this.gameState}, so not processing the suggestion.`);
		}
	}

	requestProof() {
		this.setGameState(GameState.REQUESTING_PROOF);
		emitRequestProof(this.gameId, this.players[(this.currentPlayerIndex + this.proofRequestingOffset) % this.getPlayerCount()], this.processingSuggestion);
		this.setGameState(GameState.REQUESTED_PROOF);
	}

	processProof(proofProvidingPlayerId, proofCard) {
		if (this.gameState == GameState.REQUESTED_PROOF && proofProvidingPlayerId == this.players[(this.currentPlayerIndex + this.proofRequestingOffset) % this.getPlayerCount()].playerId) {
			console.log(`PROOF: ${proofCard} provided by player ${proofProvidingPlayerId}.`);
			this.setGameState(GameState.PROCESSING_PROOF);

			emitIsProofProvided(this.gameId, proofCard !== undefined, proofProvidingPlayerId);
			emitProofProvided(this.gameId, this.getCurrentPlayer(), proofCard);

			if (proofCard == undefined) {
				// Move onto next player or gathering proof.
				this.proofRequestingOffset += 1;
				if ((this.currentPlayerIndex + this.proofRequestingOffset) % this.getPlayerCount() != this.currentPlayerIndex) {
					this.requestProof(this.processingSuggestion);
					return;
				}
			}

			this.processingSuggestion = undefined;
			this.proofRequestingOffset = 1;
			this.setGameState(GameState.PROCESSED_PROOF);

			this.requestTurnCompletion();
		}
		else {
			console.error(`Proof has come from invalid player ${proofProvidingPlayerId} or during invalid state of ${this.gameState}, so not processing the proof.`);
		}
	}

	processAccusation(playerId, accusingCharacter, accusingWeapon, accusingLocation) {
		// Player can accuse before moving character, after moving character, before requesting suggestion, or after processing proof.
		if ((this.gameState == GameState.REQUESTED_MOVE || this.gameState == GameState.PROCESSED_MOVE || this.gameState == GameState.REQUESTED_SUGGESTION || this.gameState == GameState.PROCESSED_PROOF)
			&& playerId == this.getCurrentPlayer().playerId) {
			if (this.mysteryCards[0].name == accusingCharacter && this.mysteryCards[1].name == accusingWeapon && this.mysteryCards[2].name == accusingLocation) {
				emitAccusationCorrect(this.gameId, this.getCurrentPlayer(), accusingCharacter, accusingWeapon, accusingLocation);
				this.setGameState(GameState.GAME_OVER);
			}
			else {
				// Mark the player as no longer able to play in the game.
				this.getCurrentPlayer().canPlay = false;

				if (this.players.findIndex(player => player.canPlay) === -1) {
					// All players had made incorrect accusations, so game over.
					emitAccusationIncorrect(this.gameId, this.getCurrentPlayer(), accusingCharacter, accusingWeapon, accusingLocation, this.mysteryCards[0], this.mysteryCards[1], this.mysteryCards[2], true);
					this.setGameState(GameState.GAME_OVER);
				}
				else {
					emitAccusationIncorrect(this.gameId, this.getCurrentPlayer(), accusingCharacter, accusingWeapon, accusingLocation, this.mysteryCards[0], this.mysteryCards[1], this.mysteryCards[2], false);
					
					// UNCOMMENT THIS FOR ALLOWING HALLWAYS TO WORK
					this.getCurrentPlayer().character.movePieceToNearestRoom();
					this.emitCurrentGameState();

					this.setGameState(GameState.PROCESSED_ACCUSATION);
					this.requestTurnCompletion();
				}
			}
		}
		else {
			console.error(`Accusation has come from invalid player ${playerId} or during invalid state of ${playerId}, so not processing the accusation.`);
		}
	}

	emitCurrentGameState() {
		emitGameState(this.gameId, this.totalCharacterPieces, this.totalWeaponPieces);
	}

	setGameState(gameState)
	{
		// console.log(`GAME STATE: ${gameState}`);
		this.gameState = gameState;
	}
}
