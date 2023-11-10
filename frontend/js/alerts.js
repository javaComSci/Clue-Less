/*
 * Maps an alert to a new game state
 */
export const GameAlerts = {
	'INFO_GAME_STATE':{
		'alerts': [{'name':'infoGameState','content':'Wait...'}]
	},
	'INFO_NEW_PLAYER':{
		'alerts': [{'name':'infoNewPlayer','content':'Begin!'}]
	},
	'INFO_YOUR_TURN':{
		'alerts': [{'name':'infoYourTurn','content':'Your turn!'}]
	},
	'INFO_OPPONENT_TURN':{
		'alerts': [{'name':'infoOpponentTurn','content':'Waiting on opponent'}]
	},
	'INFO_SUGGESTION_STARTED':{
		'alerts': [{'name':'infoSuggestionStarted','content':'Suggestion! Pick a player or weapon.'}]
	},
	'INFO_ACCUSATION_STARTED':{
		'alerts': [{'name':'infoAccusationStarted','content':'Accusation! Pick a player, weapon, or room.'}]
	},
	'INFO_WAITING_PROOF':{
		'alerts': [{'name':'infoWaitingProof','content':'Please wait for proof!'}]
	},
	'INFO_REQUESTING_PROOF_BROADCAST':{
		'alerts': [{'name':'infoRequestingProofBroadcast','content':'Suggestion started! Gathering proof...'}]
	},
	'PROMPT_NEED_WEAPON':{
		'alerts': [{'name':'promptNeedWeapon','content':'Select a weapon'}]
	},
	'PROMPT_NEED_LOCATION':{
		'alerts': [{'name':'promptNeedLocation','content':'Select a location'}]
	},
	'PROMPT_NEED_CHARACTER':{
		'alerts': [{'name':'promptNeedCharacter','content':'Select a character'}]
	},
	'PROMPT_PROOF_REQUESTED':{
		'alerts': [{'name':'promptProofRequested','content':'Proof requested! Select a card'}]
	},
	'PROMPT_END_TURN':{
		'alerts': [{'name':'promptEndTurn','content':'Click End Turn to Finish Turn'}]
	},
	'ERROR_WAITING_PROOF':{
		'alerts': [{'name':'errorWaitingProof','content':'Please wait for proof!'}]
	},
	'ERROR_SUGGESTION_RUNNING':{
		'alerts': [{'name':'errorSuggestionRunning','content':'Already making suggestion!'}]
	},
	'ERROR_ACCUSATION_RUNNING':{
		'alerts': [{'name':'errorAccusationRunning','content':'Already making accusation!'}]
	},
	'ERROR_ACCUSATION_BLOCKED':{
		'alerts': [{'name':'errorAccusationBlocked','content':'Cannot make accusation right now!'}]
	},
	'ERROR_PASS_BLOCKED':{
		'alerts': [{'name':'errorPassBlocked','content':'You can pass when prompted for proof.'}]
	},
	'ERROR_ACTION_BLOCKED':{
		'alerts': [{'name':'errorActionBlocked','content':'Cannot perform action right now.'}]
	},
}
