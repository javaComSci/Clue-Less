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
			'suggestion':0, 	// doing suggestion
			'accusation':0, 	// doing accusation
			'proof_select':0, 	// selecting proof
			'proof_pending':0	// waiting to receive proof
		};
		this.actionValid = {
			'end_turn': 0,		// can end turn
			'suggestion': 0,	// can start a suggestion
			'pass':0			// can pass turn
		};
		this.validationInfo = {
			'move': []
		};
	}
	updateGameState(state)
	{
		console.log('Update Game State!: ' + state);
		state['cards'] = this.playerInfo['cards'];
		this.uiManager.updateGameState(state);
	}

	setPlayerInfo(playerInfo)
	{
		this.playerInfo = playerInfo;
		console.log(this.playerInfo);
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
	selectCard(cardName, cardType)
	{
		if ((this.actionValid['pass'] == 1) && (this.actionLock['proof_select'] == 1))
		{

			// message backend
			this.msgEngine.send('proof', {
				'playerId':this.playerId,
				'gameId':this.gameId,
				'proofCard':cardName});
			// reset valid
			this.actionValid['pass'] = 0;
			// reset lock
			this.actionLock['proof_select'] = 0;
		}
		else
		{
			console.log('Selected card: ' + cardName);
		}
	}
	selectPlayer(character)
	{
		// if suggestion is active
		if(this.actionLock['suggestion'] == 1)
		{
			// if player has not submitted suggestion and is waiting for proof
			if(this.actionLock['proof_pending'] != 1)
			{
				// define it
				this.actionData['suggestion']['character'] = character;
				// if no other details needed for suggestion
				if(this.actionData['suggestion']['weapon'] != '')
				{
					// send suggestion to backend
					this.msgEngine.send('suggestion', {
						'playerId':this.playerId,
						'gameId':this.gameId,
						'suggestedCharacterName':this.actionData['suggestion']['character'],
						'suggestedWeaponName':this.actionData['suggestion']['weapon']});
					// reset suggestion information
					this.actionData['suggestion'] = {'character':'','weapon':''};
					this.actionLock['proof_pending'] = 1;
				}
				// otherwise, prompt for more details
				else
				{
					this.promptPlayer('SUGGESTION_NEED_WEAPON');
				}
			}
			else
			{
				console.log('waiting for proof!');
			}
		}
		else
		{
			console.log('Clicked on Character: ' + character);
		}
	}
	selectWeapon(weapon)
	{
		// if suggestion is active
		if(this.actionLock['suggestion'] == 1)
		{
			// if player has not submitted suggestion and is waiting for proof
			if(this.actionLock['proof_pending'] != 1)
			{
				// define it
				this.actionData['suggestion']['weapon'] = weapon;
				// if no other details needed for suggestion
				if(this.actionData['suggestion']['character'] != '')
				{
					// send suggestion to backend
					this.msgEngine.send('suggestion', {
						'playerId':this.playerId,
						'gameId':this.gameId,
						'suggestedCharacterName':this.actionData['suggestion']['character'],
						'suggestedWeaponName':this.actionData['suggestion']['weapon']});
					// reset suggestion information
					this.actionData['suggestion'] = {'character':'','weapon':''};
					this.actionLock['proof_pending'] = 1;
				}
				// otherwise, prompt for more details
				else
				{
					this.promptPlayer('SUGGESTION_NEED_CHARACTER');
				}
			}
			else
			{
				console.log('waiting for proof!');
			}
		}
		else
		{
			console.log('Clicked on Weapon: ' + weapon);
		}

	}
	selectButton(button)
	{
		if((button == 'END_TURN') && (this.actionValid['end_turn'] == 1))
		{
			this.msgEngine.send('turncomplete', {'playerId':this.playerId,'gameId':this.gameId});
			this.disableEndTurn();
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
		}
		if(button == 'PASS')
		{
			// if player can pass
			if ((this.actionValid['pass'] == 1) && (this.actionLock['proof_select'] == 1))
			{

				// message backend
				this.msgEngine.send('proof', {'playerId':this.playerId, 'gameId':this.gameId});
				// reset valid action
				this.actionValid['pass'] = 0;
				// reset lock
				this.actionLock['proof_select'] = 0;
			}
			else
			{
				console.log('Pass only available when prompted for proof');
			}
		}
	}
	selectRoom(room)
	{
		if( ( this.actionValid['move'] == 1 ) && ( this.validationInfo['move'].includes(room) == true ))
		{
			console.log('Move player to: ' + room);
			this.actionValid['move'] = 0;
			this.validationInfo['move'] = [];
			this.msgEngine.send('move',{'playerId':this.playerId,'gameId':this.gameId,'newCharacterLocation':room});
		}
		else
		{
			console.log('Room selected: ' + room);
		}
	}
	selectHallway(hallway)
	{
		if( ( this.actionValid['move'] == 1 ) && ( this.validationInfo['move'].includes(hallway) == true ))
		{
			console.log('Move player to: ' + hallway);
			this.actionValid['move'] = 0;
			this.validationInfo['move'] = [];
			this.msgEngine.send('move',{'playerId':this.playerId,'gameId':this.gameId,'newCharacterLocation':hallway});
		}
		else
		{
			console.log('Hallway selected: ' + hallway);
		}
	}
	enableSuggestion()
	{
		this.actionValid['suggestion'] = 1;
	}
	disableSuggestion()
	{
		this.actionValid['suggestion'] = 0;
		this.actionLock['proof_pending'] = 0;
		this.actionLock['suggestion'] = 0;
	}
	enableProof()
	{
		this.actionLock['proof_select'] = 1;
		this.actionValid['pass'] = 1;
		this.promptPlayer('PROVIDE_PROOF');
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
	setSuggestionLock()
	{
		this.actionLock['suggestion'] = 1;
	}
	testme(data)
	{
		console.log(data);
	}
}
