import { CharacterConstants, CharacterCard } from  '../../common/representations/character.mjs';
import { LocationConstants, LocationCard } from '../../common/representations/location.mjs';
import { WeaponConstants, WeaponCard } from '../../common/representations/weapon.mjs';
import { emitGameCannotStart, requestMove } from '../interactions/moves.js';

export class GameState
{
    constructor(gameId)
	{
		this.gameId = gameId;

		this.availableCharacters = [
			CharacterConstants.SCARLET,
			CharacterConstants.PLUM,
			CharacterConstants.PEACOCK,
			CharacterConstants.GREEN,
			CharacterConstants.WHITE,
			CharacterConstants.MUSTARD
		];

		this.players = [];
		this.currentPlayer;

		this.totalCharacterCards = this.initializeCharacterCards();
		this.totalLocationCards = this.initializeLocationCards();
		this.totalWeaponCards = this.initializeWeaponCards();
		this.cards = [];
		this.mysteryCards = [];
	}

	initializeCharacterCards()
	{
		// Provide starting locations on initialization of character cards.
		var scarlet = new CharacterCard(CharacterConstants.SCARLET, LocationConstants.Start.HALL_LOUNGE_HOME);
		var plum = new CharacterCard(CharacterConstants.PLUM, LocationConstants.Start.LIBRARY_STUDY_HOME);
		var peacock = new CharacterCard(CharacterConstants.PEACOCK, LocationConstants.Start.CONSERVATORY_LIBRARY_HOME);
		var green = new CharacterCard(CharacterConstants.GREEN, LocationConstants.Start.BALLROOM_CONSERVATORY_HOME);
		var white = new CharacterCard(CharacterConstants.WHITE, LocationConstants.Start.KITCHEN_BALLROOM_HOME);
		var mustard = new CharacterCard(CharacterConstants.MUSTARD, LocationConstants.Start.LOUNGE_DININGROOM_HOME);

		return [scarlet, plum, peacock, green, white, mustard];
	}

	initializeLocationCards()
	{
		// Location card name and location should be the same.
		var hall = new LocationCard(LocationConstants.Room.HALL, LocationConstants.Room.HALL);
		var lounge = new LocationCard(LocationConstants.Room.LOUNGE, LocationConstants.Room.LOUNGE);
		var diningroom = new LocationCard(LocationConstants.Room.DININGROOM, LocationConstants.Room.DININGROOM);
		var kitchen = new LocationCard(LocationConstants.Room.KITCHEN, LocationConstants.Room.KITCHEN);
		var ballroom = new LocationCard(LocationConstants.Room.BALLROOM, LocationConstants.Room.BALLROOM);
		var conservatory = new LocationCard(LocationConstants.Room.CONSERVATORY, LocationConstants.Room.CONSERVATORY);
		var library = new LocationCard(LocationConstants.Room.LIBRARY, LocationConstants.Room.LIBRARY);
		var study = new LocationCard(LocationConstants.Room.STUDY, LocationConstants.Room.STUDY);
		var billiardroom = new LocationCard(LocationConstants.Room.BILLIARDROOM, LocationConstants.Room.BILLIARDROOM);

		return [hall, lounge, diningroom, kitchen, ballroom, conservatory, library, study, billiardroom];
	}

	initializeWeaponCards()
	{
		// Weapon cards do not have any initial starting location.
		var candlestick = new WeaponCard(WeaponConstants.CANDLESTICK, LocationConstants.None);
		var dragger = new WeaponCard(WeaponConstants.DRAGGER, LocationConstants.None);
		var pipe = new WeaponCard(WeaponConstants.PIPE, LocationConstants.None);
		var revolver = new WeaponCard(WeaponConstants.REVOLVER, LocationConstants.None);
		var rope = new WeaponCard(WeaponConstants.ROPE, LocationConstants.None);
		var wrench = new WeaponCard(WeaponConstants.WRENCH, LocationConstants.None);

		return [candlestick, dragger, pipe, revolver, rope, wrench];
	}

	getPlayerCount()
	{
		return this.players.length;
	}

	addPlayer(player)
	{
		// Assign next available character to player.
		player.character = this.availableCharacters[this.getPlayerCount()];
		this.players.push(player);
	}

	chooseMysteryCardIndexFromSelection(cards)
	{
		// Hardcoded mystery cards for initial increments.
		return 0;
	}

	allocateMysteryCards()
	{
		let characterMysteryCardIndex = this.chooseMysteryCardIndexFromSelection(this.totalCharacterCards);
		let locationMysteryCardIndex = this.chooseMysteryCardIndexFromSelection(this.totalLocationCards);
		let weaponMysteryCardIndex = this.chooseMysteryCardIndexFromSelection(this.totalWeaponCards);

		this.mysteryCards = [
			this.totalCharacterCards[characterMysteryCardIndex],
			this.totalLocationCards[locationMysteryCardIndex],
			this.totalWeaponCards[weaponMysteryCardIndex]
		];

		console.log(this.mysteryCards);
	}

	startGame()
	{
		if (this.getPlayerCount() < 3)
		{
			emitGameCannotStart(this.gameId);
		}
		else
		{
			this.allocateMysteryCards();
			requestMove();
		}
	}

	printGameState()
	{
		console.log(JSON.stringify(this, null, 4));
	}
}