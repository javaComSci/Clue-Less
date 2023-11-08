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
		this.validAction = {
			'end_turn': 0
		};
		this.validationInfo = {
			'move': []
		};
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
	promptPlayer(ask)
	{
		/* TODO: Alert player
		 */
		console.log(ask);
		if(ask == 'END_TURN')
		{
			this.enableEndTurn();
		}
	}
	setPlayerTurn(playerInfo)
	{
		console.log('Player\'s Turn: ' + playerInfo);
	}
	selectButton(button)
	{
		if((button == 'END_TURN') && (this.validAction['end_turn'] == 1))
		{
			this.msgEngine.send('turncomplete', {'playerId':this.playerId,'gameId':this.gameId});
		}
	}
	selectArea(area)
	{
		if( ( this.validAction['move'] == 1 ) && ( this.validationInfo['move'].includes(area) == true ))
		{
			console.log('Move player to: ' + area);
			this.validAction['move'] = 0;
			this.validationInfo['move'] = [];
			this.msgEngine.send('move',{'playerId':this.playerId,'gameId':this.gameId,'newCharacterLocation':area});
		}
		else
		{
			console.log('Player selected: ' + area);
		}
	}
	enableSuggestion()
	{
	}
	enableEndTurn()
	{
		this.validAction['end_turn'] = 1;
	}
	disableEndTurn()
	{
		this.validAction['end_turn'] = 0;
	}
	enableMove(moves)
	{
		this.validAction['move'] = 1;
		this.validationInfo['move'] = moves['potentialMoves'];
		this.enableEndTurn();
		console.log(moves);
	}
	updateGameState(state)
	{
		console.log('Update Game State!: ' + state);
		state['cards'] = this.playerInfo['cards'];
		this.uiManager.updateGameState(state);
	}

}
