/*
 * Interface ( facade ) between the user and the UI for login.
 */

import { EngineComm } from "/js/engineComm.js";
import { LoginClient } from '/js/loginClient.js';

export class GameClient
{
	constructor()
	{
		this.msgEngine = new EngineComm();
		this.playerId = crypto.randomUUID();

		window.client = new LoginClient(this.msgEngine, this.playerId);
	}
}
