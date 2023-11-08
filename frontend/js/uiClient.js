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
		this.actionData = {
			'suggestion':{
				'character':'',
				'weapon':''
			},
			'accusation':{
				'character':'',
				'weapon':'',
				'room':''
			}
		};
		this.actionLock = {
			'suggestion':0,
			'accusation':0
		};
		this.actionValid = {
			'end_turn': 0,
			'suggestion': 0
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
		console.log('Player\'s Turn: ' + playerInfo.playerId);
	}
	selectButton(button)
	{
		if((button == 'END_TURN') && (this.actionValid['end_turn'] == 1))
		{
			this.msgEngine.send('turncomplete', {'playerId':this.playerId,'gameId':this.gameId});
		}
		if((button == 'SUGGESTION') && (this.actionValid['suggestion'] == 1))
		{
			if (this.actionLock['suggestion'] != 1)
			{
				this.setSuggestionLock();
				this.promptPlayer('SUGGESTION_PLAYER');
			}
			else
			{
				this.promptPlayer('SUGGESTION_RUNNING');
			}
			//this.msgEngine.send('suggestion', {'playerId':this.playerId,'gameId':this.gameId,'suggestedCharacterName':character,'suggestedWeaponName':weapon});
		}
	}
	selectArea(area)
	{
		if( ( this.actionValid['move'] == 1 ) && ( this.validationInfo['move'].includes(area) == true ))
		{
			console.log('Move player to: ' + area);
			this.actionValid['move'] = 0;
			this.validationInfo['move'] = [];
			this.msgEngine.send('move',{'playerId':this.playerId,'gameId':this.gameId,'newCharacterLocation':area});
		}
		else
		{
			console.log('Player selected: ' + area);
		}
	}
	setSuggestionLock()
	{
		this.actionLock['suggestion'] = 1;
	}
	enableSuggestion()
	{
		this.actionValid['suggestion'] = 1;
	}
	enableEndTurn()
	{
		this.actionValid['end_turn'] = 1;
	}
	disableEndTurn()
	{
		this.actionValid['end_turn'] = 0;
	}
	enableMove(moves)
	{
		this.actionValid['move'] = 1;
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
