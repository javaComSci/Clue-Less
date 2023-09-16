import { Character, CharacterConstants } from  '../../common/representations/character.mjs';
import { LocationConstants } from '../../common/representations/location.mjs';

export class GameState
{
    constructor(gameId)
	{
		this.gameId = gameId;
		this.characters = this.createCharacters();
		this.players = [];
		this.currentPlayer;
	}

	createCharacters()
	{
		var scarlet = new Character(CharacterConstants.SCARLET, LocationConstants.Start.HALL_LOUNGE_HOME);
		var plum = new Character(CharacterConstants.PLUM, LocationConstants.Start.LIBRARY_STUDY_HOME);
		var peacock = new Character(CharacterConstants.PEACOCK, LocationConstants.Start.CONSERVATORY_LIBRARY_HOME);
		var green = new Character(CharacterConstants.GREEN, LocationConstants.Start.BALLROOM_CONSERVATORY_HOME);
		var white = new Character(CharacterConstants.WHITE, LocationConstants.Start.KITCHEN_BALLROOM_HOME);
		var mustard = new Character(CharacterConstants.MUSTARD, LocationConstants.Start.LOUNGE_DININGROOM_HOME);

		return [scarlet, plum, peacock, green, white, mustard];
	}

	getPlayerCount()
	{
		return this.players.length;
	}

	addPlayer(player)
	{
		// Assign a character to player.
		player.character = this.characters[this.getPlayerCount()];
		this.players.push(player);
	}

	startGame()
	{
		if (this.getPlayerCount < 3)
		{
			alertGameCannotStart(this.gameId);
		}
		else
		{
			requestMove();
		}
	}

	printGameState()
	{
		console.log(JSON.stringify(this, null, 4));
	}
}