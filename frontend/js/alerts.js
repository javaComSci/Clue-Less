/*
 * Maps an alert to a new game state
 */
export class GameAlerts {
	constructor()
	{
		this.gameAlerts = {
			'INFO_GAME_STATE'					: this.infoGameState.bind(this),
			'INFO_CLIENT_JOINED'				: this.infoClientJoined.bind(this),
			'INFO_NEW_PLAYER'					: this.infoNewPlayer.bind(this),
			'INFO_YOUR_TURN'					: this.infoYourTurn.bind(this),
			'INFO_VALID_MOVES_PLAYER_LOSES'		: this.infoValidMovesPlayerLoses.bind(this),
			'INFO_OPPONENT_TURN'				: this.infoOpponentTurn.bind(this),
			'INFO_OPPONENT_TURN_PLAYER_LOSES'	: this.infoOpponentTurnPlayerLoses.bind(this),
			'INFO_SUGGESTION_STARTED'			: this.infoSuggestionStarted.bind(this),
			'INFO_ACCUSATION_STARTED'			: this.infoAccusationStarted.bind(this),
			'INFO_WAITING_PROOF'				: this.infoWaitingProof.bind(this),
			'INFO_NO_PROOF'						: this.infoNoProof.bind(this),
			'INFO_PROOF_SENT'					: this.infoProofSent.bind(this),
			'INFO_PROOF_PROVIDED'				: this.infoProofProvided.bind(this),
			'INFO_PROOF_RECEIVED'				: this.infoProofReceived.bind(this),
			'INFO_PASSED'						: this.infoPassed.bind(this),
			'INFO_REQUESTING_PROOF_BROADCAST'	: this.infoRequestingProofBroadcast.bind(this),
			'INFO_VALID_MOVES'					: this.infoValidMoves.bind(this),
			'INFO_VALID_ACTIONS'				: this.infoValidActions.bind(this),
			'INFO_PLAYER_WINS'				    : this.infoPlayerWins.bind(this),
			'INFO_PLAYER_LOSES'				    : this.infoPlayerLoses.bind(this),
			'INFO_GAME_OVER'					: this.infoGameOver.bind(this),
			'PROMPT_NEED_WEAPON'				: this.promptNeedWeapon.bind(this),
			'PROMPT_NEED_LOCATION'				: this.promptNeedLocation.bind(this),
			'PROMPT_NEED_CHARACTER'				: this.promptNeedCharacter.bind(this),
			'PROMPT_PROOF_REQUESTED'			: this.promptProofRequested.bind(this),
			'PROMPT_PASS'						: this.promptPass.bind(this),
			'PROMPT_END_TURN'					: this.promptEndTurn.bind(this),
			'ERROR_WAITING_PROOF'				: this.errorWaitingProof.bind(this),
			'ERROR_SUGGESTION_RUNNING'			: this.errorSuggestionRunning.bind(this),
			'ERROR_ACCUSATION_RUNNING'			: this.errorAccusationRunning.bind(this),
			'ERROR_ACCUSATION_BLOCKED'			: this.errorAccusationBlocked.bind(this),
			'ERROR_PASS_BLOCKED'				: this.errorPassBlocked.bind(this),
			'ERROR_PASS_BLOCKED_PROVIDE_PROOF'	: this.errorPassBlockedProvideProof.bind(this),
			'ERROR_ACTION_BLOCKED'				: this.errorActionBlocked.bind(this),
			'ERROR_PROOF_INVALID'				: this.errorProofInvalid.bind(this),
			'ERROR_NOT_ENOUGH_PLAYERS'			: this.errorNotEnoughPlayers.bind(this),
			'ERROR_PLAYER_DISABLED'			    : this.errorPlayerDisabled.bind(this),
			'ERROR_INVALID_DESTINATION'			: this.errorInvalidDestination.bind(this),
			'ERROR_CANNOT_MOVE'					: this.errorCannotMove.bind(this),
			'ERROR_WAITING_ON_OPPONENT'			: this.errorWaitingOnOpponent.bind(this),

		}
	}
	getValidActions(actions)
	{
		let actionList = [];
		for(var action in actions)
		{
			if(actions[action] == 1)
			{
				actionList.push(action)
			}
		}
		return actionList;
	}
	generateAlert(name, data)
	{
		let alerts = this.gameAlerts[name](data);
		return alerts;
	}
	infoPlayerWins({winningPlayer,accusedCharacter,accusedWeapon,accusedLocation})
	{
		return {'alerts':[{'name':'infoPlayerWins','content':'Player ' + winningPlayer.character.name + ' wins! Solution: ' + accusedCharacter + ', ' + accusedWeapon + ', ' + accusedLocation}]};
	}
	infoPlayerLoses({solution, accusation, player})
	{
		if(solution != undefined)
		{
			let solChar = solution['correctCharacter'];
			let solWeapon = solution['correctWeapon'];
			let solLocation = solution['correctLocation'];
			return {'alerts':[{'name':'infoPlayerLoses','content':'You lose. Solution: ' + solChar.name + ' with the ' + solWeapon.name + ' in the ' + solLocation.name + '. Spectating ' + player + '...'}]}
		}
		else
		{
			let accPlayer = accusation['accusingPlayer']['character']['name'];
			let accChar = accusation['accusedCharacter'];
			let accWeapon = accusation['accusedWeapon'];
			let accLocation = accusation['accusedLocation'];
			return {'alerts':[{'name':'infoPlayerLoses','content':'Player ' + accPlayer + ' loses. Accused: ' + accChar + ' with the ' + accWeapon + ' in the ' + accLocation + '. Spectating...'}]};
		}
	}
	infoValidMovesPlayerLoses({accusation, move})
	{
		let accPlayer = accusation['accusingPlayer']['character']['name'];
		let accChar = accusation['accusedCharacter'];
		let accWeapon = accusation['accusedWeapon'];
		let accLocation = accusation['accusedLocation'];
		let content = move.join(', ');
		return {'alerts':[{'name':'infoPlayerLoses','content': 'Your Turn! ' + accPlayer + ' loses! Accusation: ' + accChar + ', ' + accWeapon + ', ' + accLocation + '. Select Action or Move: ' + content }]};
	}
	infoOpponentTurnPlayerLoses({accusation, player})
	{
		let accPlayer = accusation['accusingPlayer']['character']['name'];
		let accChar = accusation['accusedCharacter'];
		let accWeapon = accusation['accusedWeapon'];
		let accLocation = accusation['accusedLocation'];
		return {'alerts':[{'name':'infoPlayerLoses','content':'Player ' + accPlayer + ' loses. Accused: ' + accChar + ' with the ' + accWeapon + ' in the ' + accLocation + '. ' + player + '\'S Turn...'}]};
	}
	infoGameOver({solution,accusation})
	{
		let solChar = solution['correctCharacter'];
		let solWeapon = solution['correctWeapon'];
		let solLocation = solution['correctLocation'];
		return {'alerts':[{'name':'infoGameOver','content':'Game Over! No one wins. Solution: ' + solChar.name + ' with the ' + solWeapon.name + ' in the ' + solLocation.name}]}
	}
	infoProofReceived({actions,proof})
	{
		let actionList = this.getValidActions(actions);
		return {'alerts':[{'name':'infoNoProof','content':'Proof received: ' + proof + '   Valid Actions: ' + actionList.join(', ')}]};
	}
	infoProofProvided()
	{
		return {'alerts':[{'name':'infoNoProof','content':'Proof has been provided! Waiting on opponent...'}]};
	}
	infoNoProof()
	{
		return {'alerts':[{'name':'infoNoProof','content':'No players provided proof! Waiting for opponent...'}]};
	}
	infoPassed()
	{
		return {'alerts':[{'name':'infoPassed','content':'You passed. Another player prompted for proof'}]};
	}
	infoProofSent(proof)
	{
		return {'alerts':[{'name':'infoProofSent','content':'You provided proof: ' + proof + '. Waiting on opponent...'}]};
	}
	infoValidActions(actions)
	{
		let actionList = this.getValidActions(actions);
		return {'alerts':[{'name':'infoValidActions','content':'Your turn! Valid Actions: ' + actionList.join(', ')}]};
	}
	infoValidMoves({potentialMoves})
	{
		let content = potentialMoves.join(', ');
		return {'alerts':[{'name':'infoValidMoves','content':'Your turn! Select Action or Move: ' + content}]};
	}
	infoGameState()
	{
		return {'alerts':[{'name':'infoGameState','content':'Wait...'}]};
	}
	infoClientJoined(name)
	{
		return {'alerts':[{'name':'infoClientJoined','content':'Welcome! Waiting for additional players...'}],'characterName':name};
	}
	infoNewPlayer(data)
	{
		return {'alerts':[{'name':'infoNewPlayer','content':'Begin!'}],'characterName':data};
	}
	infoYourTurn()
	{
		return {'alerts':[{'name':'infoYourTurn','content':'Your turn!'}]};
	}
	infoOpponentTurn(name)
	{
		return {'alerts':[{'name':'infoOpponentTurn','content':'Waiting on ' + name + '...'}]};
	}
	infoSuggestionStarted()
	{
		return {'alerts':[{'name':'infoSuggestionStarted','content':'Suggestion! Pick a player or weapon.'}]};
	}
	infoAccusationStarted()
	{
		return {'alerts':[{'name':'infoAccusationStarted','content':'Accusation! Pick a player, weapon, and room.'}]};
	}
	infoWaitingProof()
	{
		return {'alerts':[{'name':'infoWaitingProof','content':'Please wait for proof!'}]};
	}
	infoRequestingProofBroadcast()
	{
		return {'alerts':[{'name':'infoRequestingProofBroadcast','content':'Suggestion made! No proof provided yet. Waiting on opponents...'}]};
	}
	promptNeedWeapon()
	{
		return {'alerts':[{'name':'promptNeedWeapon','content':'Select a weapon'}]};
	}
	promptNeedLocation()
	{
		return {'alerts':[{'name':'promptNeedLocation','content':'Select a location'}]};
	}
	promptNeedCharacter()
	{
		return {'alerts':[{'name':'promptNeedCharacter','content':'Select a character'}]};
	}
	promptProofRequested({suggestedLocation,suggestedCharacterName,suggestedWeaponName})
	{
		return {'alerts':[{'name':'promptProofRequested','content':'Proof requested! Select a card. Must be one of: ' + suggestedLocation + ', ' + suggestedCharacterName + ', ' + suggestedWeaponName}]};
	}
	promptPass({suggestedLocation,suggestedCharacterName,suggestedWeaponName})
	{
		return {'alerts':[{'name':'promptPass','content':'Proof requested: ' + suggestedCharacterName + ', ' + suggestedWeaponName + ', ' + suggestedLocation + '...but you don\'t have relevant cards! Select Pass to skip.'}]};
	}
	promptEndTurn()
	{
		return {'alerts':[{'name':'promptEndTurn','content':'No More Actions Available. Click End Turn.'}]};
	}
	errorWaitingProof()
	{
		return {'alerts':[{'name':'errorWaitingProof','content':'Please wait for proof!'}]};
	}
	errorSuggestionRunning()
	{
		return {'alerts':[{'name':'errorSuggestionRunning','content':'Already making suggestion!'}]};
	}
	errorAccusationRunning()
	{
		return {'alerts':[{'name':'errorAccusationRunning','content':'Already making accusation! Pick player, weapon, and room'}]};
	}
	errorAccusationBlocked()
	{
		return {'alerts':[{'name':'errorAccusationBlocked','content':'Cannot make accusation right now!'}]};
	}
	errorPassBlocked(validation)
	{
		let actionList = this.getValidActions(validation);
		return {'alerts':[{'name':'errorPassBlocked','content':'You can pass when prompted for proof and have no relevant cards. Valid Actions: ' + actionList.join(', ')}]};
	}
	errorPassBlockedProvideProof({suggestedLocation,suggestedCharacterName,suggestedWeaponName})
	{
		return {'alerts':[{'name':'promptPass','content':'Cannot pass! Please select one of these cards: ' + suggestedCharacterName + ', ' + suggestedWeaponName + ', ' + suggestedLocation + '.'}]};
	}
	errorActionBlocked(info)
	{
		let actionList = this.getValidActions(info['validation']);
		return {'alerts':[{'name':'errorActionBlocked','content':'Cannot perform ' + info['selection'] + ' right now. Valid Actions: ' + actionList.join(', ')}]};
	}
	errorNotEnoughPlayers()
	{
		return {'alerts':[{'name':'errorNotEnoughPlayers','content':'Start Failed! At least three players required.'}]};
	}
	errorProofInvalid({suggestedLocation,suggestedCharacterName,suggestedWeaponName, playerChoice})
	{
		return {'alerts':[{'name':'errorProofInvalid','content':'You choose ' + playerChoice + '. Card must be one of: ' + suggestedLocation + ', ' + suggestedCharacterName + ', ' + suggestedWeaponName + '. Or, click Pass.'}]};
	}
	errorPlayerDisabled()
	{
		return {'alerts':[{'name':'errorPlayerDisabled','content':'You are spectating and cannot perform any actions.'}]};
	}
	errorInvalidDestination({selection,validation})
	{
		let content = validation.join(', ');
		return {'alerts':[{'name':'errorInvalidDestination','content':'Cannot move to ' + selection +'. Valid Moves: ' + content }]};
	}
	errorCannotMove({selection,validation})
	{
		let content = validation.join(', ');
		return {'alerts':[{'name':'errorInvalidDestination','content':'Cannot move to ' + selection +'. Valid Moves: ' + content }]};
	}
	errorWaitingOnOpponent({selection,opponent})
	{
		return {'alerts':[{'name':'errorInvalidDestination','content':'Cannot perform ' + selection +'. Waiting on ' + opponent + '...' }]};
	}
}

