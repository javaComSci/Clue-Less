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
		this.proofReceived = '';
		this.proofProvided = false;
		this.failedAccusation = {};
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
			'Suggestion': 0,	// can start a suggestion
			'Accusation':1,		// can perform accusation
			'Pass':0,			// can pass turn
			'End Turn': 0		// can end turn
		};
		this.validationInfo = {
			'move': [],
			'proof': {}
		};
	}
	updateGameState(state)
	{
		this.uiManager.updateGameState(state);
		/*
		this.promptPlayer('INFO_GAME_STATE');
		if( this.actionValid['End Turn'] == 1 )
		{
			this.promptPlayer('INFO_YOUR_TURN');
		}
		*/
	}
	insufficientPlayers()
	{
		console.log('not enough players');
		this.promptPlayer('ERROR_NOT_ENOUGH_PLAYERS');
	}
	setPlayerStart(playerInfo)
	{
		this.playerInfo = playerInfo;
		this.promptPlayer('INFO_NEW_PLAYER');
		let startState = {'cards':this.playerInfo['cards']}
		this.updateGameState(startState);
	}
	promptPlayer(ask, data)
	{
		this.uiManager.messageUser(ask, data);
	}
	playerWins(data)
	{
		this.promptPlayer('INFO_PLAYER_WINS',data);
	}
	accusationSolution(data)
	{
		this.validationInfo['accusation'] = data;
	}
	playerLoses(data)
	{
		this.failedAccusation = data;
		let info = {
			'solution': this.validationInfo['accusation'],
			'accusation': data
		};
		if(data['isGameOver'] == false)
		{
			this.promptPlayer('INFO_PLAYER_LOSES',info);
			this.playerInfo.canPlay = false;
		}
		else
		{
			this.promptPlayer('INFO_GAME_OVER',info);
		}
	}
	setTurnComplete()
	{
		//do received proof message here, otherwise it will be overriden by REQUEST_COMPLETE_TURN
		if( this.proofReceived != '')
		{
			let data = {
				'actions': this.actionValid,
				'proof': this.proofReceived
			};
			this.promptPlayer('INFO_PROOF_RECEIVED', data);
			this.proofReceived = '';
		}
		if( this.playerInfo.canPlay == false )
		{
			this.msgEngine.send('turncomplete', {'playerId':this.playerId,'gameId':this.gameId});
		}
		else
		{
			this.promptPlayer('INFO_VALID_ACTIONS', this.actionValid);
		}
	}
	setPlayerTurn(playerInfo)
	{
		//reset proof on new turn
		this.proofProvided = false;
		if ( playerInfo.playerId == this.playerInfo.playerId )
		{
			if(this.failedAccusation['accusingPlayer'] != undefined)
			{
				this.promptPlayer('INFO_YOUR_TURN_PLAYER_LOSES', this.failedAccusation);
				this.failedAccusation = {};
			}
			else
			{
				this.promptPlayer('INFO_YOUR_TURN');
			}
			this.enableEndTurn();
		}
		else if(this.validationInfo['accusation'] != undefined)
		{
			let solution = {
				'solution': this.validationInfo['accusation']
			};
			this.promptPlayer('INFO_PLAYER_LOSES',solution);
		}
		else
		{
			if(this.failedAccusation['accusingPlayer'] != undefined)
			{
				this.promptPlayer('INFO_OPPONENT_TURN_PLAYER_LOSES', this.failedAccusation);
				this.failedAccusation = {};
			}
			else
			{
				this.promptPlayer('INFO_OPPONENT_TURN');
			}
		}
	}
	selectCard(cardName, cardType)
	{
		if ((this.actionValid['Pass'] == 1) && (this.actionLock['proof_select'] == 1))
		{
			// message backend
			let sugWeapon = this.validationInfo['proof']['suggestedWeaponName'];
			let sugChar = this.validationInfo['proof']['suggestedCharacterName'];
			let sugRoom = this.validationInfo['proof']['suggestedLocation'];
			if((cardName != sugWeapon) && (cardName != sugRoom) && (cardName != sugChar))
			{
				let data = this.validationInfo['proof'];
				data['playerChoice'] = cardName;
				this.promptPlayer('ERROR_PROOF_INVALID',data);
			}
			else
			{
				this.proofProvided = true;
				this.promptPlayer('INFO_PROOF_SENT',cardName);
				this.msgEngine.send('proof', {
					'playerId':this.playerId,
					'gameId':this.gameId,
					'proofCard':cardName});
				this.endProofRequest();
			}
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
		if(this.playerInfo.canPlay == false)
		{
			this.promptPlayer('ERROR_PLAYER_DISABLED');
		}
		else if((button == 'END_TURN') && (this.actionValid['End Turn'] == 1))
		{
			this.msgEngine.send('turncomplete', {'playerId':this.playerId,'gameId':this.gameId});
			this.resetActionStates();
		}
		else if((button == 'SUGGESTION') && (this.actionValid['Suggestion'] == 1))
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
			if ((this.actionValid['Pass'] == 1) && (this.actionLock['proof_select'] == 1))
			{

				// message backend
				this.msgEngine.send('proof', {'playerId':this.playerId, 'gameId':this.gameId});
				this.endProofRequest();
				//this.promptPlayer('INFO_PASSED');
			}
			else
			{
				this.promptPlayer('ERROR_PASS_BLOCKED');
			}
		}
		else if((button == 'ACCUSATION') && (this.actionValid['Accusation'] == 1))
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
			this.promptPlayer('INFO_VALID_ACTIONS', this.actionValid);
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
			this.promptPlayer('INFO_VALID_ACTIONS', this.actionValid);
		}
		else
		{
			console.log('Hallway selected: ' + hallway);
		}
	}
	checkProofProvided(check)
	{
		if(check == true)
		{
			if(this.proofProvided == false)
			{
				this.promptPlayer('INFO_PROOF_PROVIDED');
			}
		}
		else
		{
			this.promptPlayer('INFO_NO_PROOF');
		}
	}
	receiveProof(proof)
	{
		this.disableSuggestion();
		if(proof != undefined)
		{
			this.proofReceived = proof;
		}
		else
		{
			this.proofReceived = 'NONE';
		}
	}
	endProofRequest()
	{
		// reset valid action
		this.actionValid['Pass'] = 0;
		// reset lock
		this.actionLock['proof_select'] = 0;
		this.validationInfo['proof'] = {};
	}
	enableSuggestion()
	{
		this.actionValid['Suggestion'] = 1;
		this.promptPlayer('INFO_VALID_ACTIONS', this.actionValid);
	}
	disableSuggestion()
	{
		this.actionValid['Suggestion'] = 0;
		this.actionLock['proof_pending'] = 0;
		this.actionLock['suggestion'] = 0;
		this.actionValid['Accusation'] = 1;
	}
	disableAccusation()
	{
		this.actionValid['Accusation'] = 0;
		this.actionLock['accusation'] = 0;
		this.promptPlayer('INFO_VALID_ACTIONS', this.actionValid);
	}
	requestProof(validationData)
	{
		this.validationInfo['proof'] = validationData;
		this.actionLock['proof_select'] = 1;
		this.actionValid['Pass'] = 1;
		this.promptPlayer('PROMPT_PROOF_REQUESTED', validationData);
	}
	enableEndTurn()
	{
		this.actionValid['End Turn'] = 1;
	}
	disableEndTurn()
	{
		this.actionValid['End Turn'] = 0;
	}
	setMove(moves)
	{
		this.actionValid['move'] = 1;
		this.validationInfo['move'] = moves['potentialMoves'];
		if(this.failedAccusation['accusingPlayer'] != undefined)
		{
			this.promptPlayer('INFO_YOUR_TURN_PLAYER_LOSES', this.failedAccusation);
			this.failedAccusation = {};
		}
		else
		{
			this.promptPlayer('INFO_VALID_MOVES', moves);
		}
	}
	setSuggestionLock()
	{
		this.actionLock['suggestion'] = 1;
		this.actionValid['Accusation'] = 0;
	}
	setAccusationLock()
	{
		this.actionLock['accusation'] = 1;
		this.actionValid['Suggestion'] = 0;
	}
	testme(data)
	{
		console.log(data);
	}
}
