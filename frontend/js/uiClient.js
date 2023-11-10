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
		this.actionData;
		this.actionLock;
		this.actionValid;
		this.validationInfo;
		this.resetActionStates();
	}
	resetActionStates()
	{
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
			'pass':0,			// can pass turn
			'accusation':1		// can perform accusation
		};
		this.validationInfo = {
			'move': []
		};
	}
	updateGameState(state)
	{
		state['cards'] = this.playerInfo['cards'];
		this.uiManager.updateGameState(state);
		this.promptPlayer('INFO_GAME_STATE');
		if( this.actionValid['end_turn'] == 1 )
		{
			this.promptPlayer('INFO_YOUR_TURN');
		}
	}
	setPlayerInfo(playerInfo)
	{
		this.playerInfo = playerInfo;
		this.promptPlayer('INFO_NEW_PLAYER');
	}
	promptPlayer(ask)
	{
		/* TODO: Alert player
		 */
		if(ask == 'PROMPT_END_TURN')
		{
			this.enableEndTurn();
		}
		this.uiManager.messageUser(ask);
	}
	setPlayerTurn(playerInfo)
	{
		if ( playerInfo.playerId == this.playerInfo.playerId )
		{
			this.promptPlayer('INFO_YOUR_TURN');
		}
		else
		{
			this.promptPlayer('INFO_OPPONENT_TURN');
		}
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
					this.promptPlayer('INFO_WAITING_PROOF');
				}
				// otherwise, prompt for more details
				else
				{
					this.promptPlayer('PROMPT_NEED_WEAPON');
				}
			}
			else
			{
				this.promptPlayer('ERROR_WAITING_PROOF');
			}
		}
		else if(this.actionLock['accusation'] == 1)
		{
			// define it
			this.actionData['accusation']['character'] = character;
			// if no other details needed for accusation
			if((this.actionData['accusation']['weapon'] != '') && (this.actionData['accusation']['room'] != ''))
			{
				// send suggestion to backend
				this.msgEngine.send('accuse', {
					'playerId':this.playerId,
					'gameId':this.gameId,
					'accusingCharacter':this.actionData['accusation']['character'],
					'accusingWeapon':this.actionData['accusation']['weapon'],
					'accusingLocation':this.actionData['accusation']['room']});
				// reset accusation information ( may not be necessary )
				this.actionData['accusation'] = {'character':'','weapon':'','room':''};
			}
			// otherwise, prompt for more details
			else if(this.actionData['accusation']['weapon'] == '')
			{
				this.promptPlayer('PROMPT_NEED_WEAPON');
			}
			else if(this.actionData['accusation']['room'] == '')
			{
				this.promptPlayer('PROMPT_NEED_LOCATION');
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
					this.promptPlayer('INFO_WAITING_PROOF');
				}
				// otherwise, prompt for more details
				else
				{
					this.promptPlayer('PROMPT_NEED_CHARACTER');
				}
			}
			else
			{
				this.promptPlayer('ERROR_WAITING_PROOF');
			}
		}
		else if(this.actionLock['accusation'] == 1)
		{
			// define it
			this.actionData['accusation']['weapon'] = weapon;
			// if no other details needed for accusation
			if((this.actionData['accusation']['character'] != '') && (this.actionData['accusation']['room'] != ''))
			{
				// send suggestion to backend
				this.msgEngine.send('accuse', {
					'playerId':this.playerId,
					'gameId':this.gameId,
					'accusingCharacter':this.actionData['accusation']['character'],
					'accusingWeapon':this.actionData['accusation']['weapon'],
					'accusingLocation':this.actionData['accusation']['room']});
				// reset accusation information ( may not be necessary )
				this.actionData['accusation'] = {'character':'','weapon':'','room':''};
			}
			// otherwise, prompt for more details
			else if(this.actionData['accusation']['character'] == '')
			{
				this.promptPlayer('PROMPT_NEED_CHARACTER');
			}
			else if(this.actionData['accusation']['room'] == '')
			{
				this.promptPlayer('PROMPT_NEED_LOCATION');
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
			this.resetActionStates();
		}
		else if((button == 'SUGGESTION') && (this.actionValid['suggestion'] == 1))
		{
			if (this.actionLock['suggestion'] != 1)
			{
				this.setSuggestionLock();
				this.promptPlayer('INFO_SUGGESTION_STARTED');
			}
			else
			{
				this.promptPlayer('ERROR_SUGGESTION_RUNNING');
			}
		}
		else if(button == 'PASS')
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
				this.promptPlayer('ERROR_PASS_BLOCKED');
			}
		}
		else if((button == 'ACCUSATION') && (this.actionValid['accusation'] == 1))
		{
			if (this.actionLock['accusation'] != 1)
			{
				this.setAccusationLock();
				this.promptPlayer('INFO_ACCUSATION_STARTED');
			}
			else
			{
				this.promptPlayer('ERROR_ACCUSATION_RUNNING');
			}
		}
		else
		{
			this.promptPlayer('ERROR_ACTION_BLOCKED');
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
			this.enableEndTurn();
		}
		else if(this.actionLock['accusation'] == 1)
		{
			// define it
			this.actionData['accusation']['room'] = room;
			// if no other details needed for accusation
			if((this.actionData['accusation']['character'] != '') && (this.actionData['accusation']['weapon'] != ''))
			{
				// send suggestion to backend
				this.msgEngine.send('accuse', {
					'playerId':this.playerId,
					'gameId':this.gameId,
					'accusingCharacter':this.actionData['accusation']['character'],
					'accusingWeapon':this.actionData['accusation']['weapon'],
					'accusingLocation':this.actionData['accusation']['room']});
				// reset accusation information ( may not be necessary )
				this.actionData['accusation'] = {'character':'','weapon':'','room':''};
			}
			// otherwise, prompt for more details
			else if(this.actionData['accusation']['character'] == '')
			{
				this.promptPlayer('PROMPT_NEED_CHARACTER');
			}
			else if(this.actionData['accusation']['weapon'] == '')
			{
				this.promptPlayer('PROMPT_NEED_WEAPON');
			}
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
			this.enableEndTurn();
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
		this.actionValid['accusation'] = 1;
	}
	disableAccusation()
	{
		this.actionValid['accusation'] = 0;
		this.actionLock['accusation'] = 0;
	}
	enableProof()
	{
		this.actionLock['proof_select'] = 1;
		this.actionValid['pass'] = 1;
		this.promptPlayer('PROMPT_PROOF_REQUESTED');
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
		console.log(moves);
	}
	setSuggestionLock()
	{
		this.actionLock['suggestion'] = 1;
		this.actionValid['accusation'] = 0;
	}
	setAccusationLock()
	{
		this.actionLock['accusation'] = 1;
		this.actionValid['suggestion'] = 0;
	}
	testme(data)
	{
		console.log(data);
	}
}
