/*
 * Maps an alert to a new game state
 */
export class GameAlerts {
	constructor()
	{
		this.gameAlerts = {
			'INFO_GAME_STATE'					: this.infoGameState.bind(this),
			'INFO_NEW_PLAYER'					: this.infoNewPlayer.bind(this),
			'INFO_YOUR_TURN'					: this.infoYourTurn.bind(this),
			'INFO_OPPONENT_TURN'				: this.infoOpponentTurn.bind(this),
			'INFO_SUGGESTION_STARTED'			: this.infoSuggestionStarted.bind(this),
			'INFO_ACCUSATION_STARTED'			: this.infoAccusationStarted.bind(this),
			'INFO_WAITING_PROOF'				: this.infoWaitingProof.bind(this),
			'INFO_REQUESTING_PROOF_BROADCAST'	: this.infoRequestingProofBroadcast.bind(this),
			'INFO_VALID_MOVES'					: this.infoValidMoves.bind(this),
			'PROMPT_NEED_WEAPON'				: this.promptNeedWeapon.bind(this),
			'PROMPT_NEED_LOCATION'				: this.promptNeedLocation.bind(this),
			'PROMPT_NEED_CHARACTER'				: this.promptNeedCharacter.bind(this),
			'PROMPT_PROOF_REQUESTED'			: this.promptProofRequested.bind(this),
			'PROMPT_END_TURN'					: this.promptEndTurn.bind(this),
			'ERROR_WAITING_PROOF'				: this.errorWaitingProof.bind(this),
			'ERROR_SUGGESTION_RUNNING'			: this.errorSuggestionRunning.bind(this),
			'ERROR_ACCUSATION_RUNNING'			: this.errorAccusationRunning.bind(this),
			'ERROR_ACCUSATION_BLOCKED'			: this.errorAccusationBlocked.bind(this),
			'ERROR_PASS_BLOCKED'				: this.errorPassBlocked.bind(this),
			'ERROR_ACTION_BLOCKED'				: this.errorActionBlocked.bind(this),
			'ERROR_NOT_ENOUGH_PLAYERS'			: this.errorNotEnoughPlayers.bind(this),

		}
	}
	generateAlert(name, data)
	{
		let alerts = this.gameAlerts[name](data);
		return {'alerts': alerts};
	}
	infoValidMoves({potentialMoves})
	{
		let content = potentialMoves.join(',');
		return [{'name':'infoValidMoves','content':'Valid Moves: ' + content}];
	}
	infoGameState()
	{
		return [{'name':'infoGameState','content':'Wait...'}];
	}
	infoNewPlayer()
	{
		return [{'name':'infoNewPlayer','content':'Welcome! Waiting for additional players...'}];
	}
	infoYourTurn()
	{
		return [{'name':'infoYourTurn','content':'Your turn!'}];
	}
	infoOpponentTurn()
	{
		return [{'name':'infoOpponentTurn','content':'Waiting on opponent...'}];
	}
	infoSuggestionStarted()
	{
		return [{'name':'infoSuggestionStarted','content':'Suggestion! Pick a player or weapon.'}];
	}
	infoAccusationStarted()
	{
		return [{'name':'infoAccusationStarted','content':'Accusation! Pick a player, weapon, or room.'}];
	}
	infoWaitingProof()
	{
		return [{'name':'infoWaitingProof','content':'Please wait for proof!'}];
	}
	infoRequestingProofBroadcast()
	{
		return [{'name':'infoRequestingProofBroadcast','content':'Suggestion started! Gathering proof...'}];
	}
	promptNeedWeapon()
	{
		return [{'name':'promptNeedWeapon','content':'Select a weapon'}];
	}
	promptNeedLocation()
	{
		return [{'name':'promptNeedLocation','content':'Select a location'}];
	}
	promptNeedCharacter()
	{
		return [{'name':'promptNeedCharacter','content':'Select a character'}];
	}
	promptProofRequested()
	{
		return [{'name':'promptProofRequested','content':'Proof requested! Select a card'}];
	}
	promptEndTurn()
	{
		return [{'name':'promptEndTurn','content':'No More Actions Available. Click End Turn.'}];
	}
	errorWaitingProof()
	{
		return [{'name':'errorWaitingProof','content':'Please wait for proof!'}];
	}
	errorSuggestionRunning()
	{
		return [{'name':'errorSuggestionRunning','content':'Already making suggestion!'}];
	}
	errorAccusationRunning()
	{
		return [{'name':'errorAccusationRunning','content':'Already making accusation!'}];
	}
	errorAccusationBlocked()
	{
		return [{'name':'errorAccusationBlocked','content':'Cannot make accusation right now!'}];
	}
	errorPassBlocked()
	{
		return [{'name':'errorPassBlocked','content':'You can pass when prompted for proof.'}];
	}
	errorActionBlocked()
	{
		return [{'name':'errorActionBlocked','content':'Cannot perform action right now.'}];
	}
	errorNotEnoughPlayers()
	{
		return [{'name':'errorNotEnoughPlayers','content':'Start Failed! At least three players required.'}];
	}
}
