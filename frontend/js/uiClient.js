/*
 * Interface ( facade ) between the user and the UI. Communicates actions to UI in accordance with game engine.
 */
import { EngineComm } from "/js/engineComm.js";
import { UIManager } from "/js/uiManager.js";
export class UIClient
{
	constructor()
	{
		this.uiManager = new UIManager();
		this.msgEngine = new EngineComm();
		this.gameId = '1';
		this.playerId = crypto.randomUUID();
		this.msgEngine.send('start', {'playerId': this.playerId, 'gameId': this.gameId } );
		this.playerInfo;
	}
	setPlayerInfo(playerInfo)
	{
		this.playerInfo = playerInfo;
		console.log(this.playerInfo);
	}
	testme(data)
	{
		console.log(data);
	}

}
