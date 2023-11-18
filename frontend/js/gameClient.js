/*
 * Interface ( facade ) between the user and the UI for login.
 */

import { GameBoardClient } from '/js/gameBoardClient.js';
import { LoginClient } from '/js/loginClient.js';

export class GameClient
{
	constructor()
	{
		// window.client = new LoginClient();
		window.client = new GameBoardClient();
	}
}
