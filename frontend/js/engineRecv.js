/*
 * Receives messages from the Backend
 */
export class EngineRecv
{
	constructor(socket) {
		/*
		 * Listens for events from game engine
		 */
		this.socket = socket;
		this.socketRecvMessages = {
			'insufficientPlayerCount' 	        : this.msgInsufficientPlayerCount.bind(this),
			'PLAYER_START_INFO' 		        : this.msgPlayerStartInfo.bind(this),
			'GAME_STATE' 				        : this.msgGameState.bind(this),
			'REQUESTING_MOVE_BROADCAST'         : this.msgRequestingMoveBroadcast.bind(this),
			'REQUESTING_PROOF_BROADCAST'        : this.msgRequestingProofBroadcast.bind(this),
			'REQUEST_MOVE'				        : this.msgRequestingMove.bind(this),
			'REQUEST_SUGGESTION'		        : this.msgRequestSuggestion.bind(this),
			'REQUEST_PROOF'				        : this.msgRequestProof.bind(this),
			'IS_PROOF_PROVIDED'			        : this.msgIsProofProvided.bind(this),
			'PROOF_PROVIDED'			        : this.msgProofProvided.bind(this),
			'ACCUSATION_CORRECT'		        : this.msgAccusationCorrect.bind(this),
			'ACCUSATION_INCORRECT'		        : this.msgAccusationIncorrect.bind(this),
			'ACCUSATION_SOLUTION'		        : this.msgAccusationSolution.bind(this),
			'REQUEST_TURN_COMPLETE_CONFIRM'		: this.msgTurnCompleteConfirmation.bind(this)
		}
		this.initializeListeners();
	}
	initializeListeners()
	{
		for( var msg in this.socketRecvMessages )
		{
			this.socketRecvMessages[msg]();
		}
	}
	/*
	 * STUBS
	 */
	msgInsufficientPlayerCount()
	{
		this.socket.on('insufficientPlayerCount', function (obj) {
			window.client.insufficientPlayers();
		});
	}
	msgPlayerStartInfo()
	{
		this.socket.on('PLAYER_START_INFO', function (obj) {
			window.client.setPlayerStart(obj);
		});
	}
	msgGameState()
	{
		this.socket.on('GAME_STATE', function (obj) {
			window.client.updateGameState(obj);
		});
	}
	msgRequestingMoveBroadcast()
	{
		this.socket.on('REQUESTING_MOVE_BROADCAST', function (obj) {
			//window.client.promptPlayer('INFO_OPPONENT_TURN');
			window.client.setPlayerTurn(obj);
		});
	}
	msgRequestingProofBroadcast()
	{
		this.socket.on('REQUESTING_PROOF_BROADCAST', function (obj) {
			//TODO: Alert players
			//window.client.promptPlayer('INFO_REQUESTING_PROOF_BROADCAST');
		});
	}
	msgRequestingMove()
	{
		this.socket.on('REQUEST_MOVE', function (obj) {
			window.client.enableMove(obj);
		});
	}
	msgRequestSuggestion()
	{
		this.socket.on('REQUEST_SUGGESTION', function () {
			window.client.enableSuggestion();
		});
	}
	msgRequestProof()
	{
		this.socket.on('REQUEST_PROOF', function () {
			window.client.enableProof();
		});
	}
	msgIsProofProvided()
	{
		this.socket.on('IS_PROOF_PROVIDED', function (data) {
			/* TODO: Alert players */
			//console.log('Proof provided!');
			//window.client.testme(JSON.stringify(data));
		});
	}
	msgProofProvided()
	{
		this.socket.on('PROOF_PROVIDED', function (data) {
			/* TODO: Alert player */
			//console.log('PROOF_PROVIDED_BY: ' + JSON.stringify(data));
			window.client.disableSuggestion();
		});
	}
	msgAccusationCorrect()
	{
		this.socket.on('ACCUSATION_CORRECT', function (data) {
			/* TODO: Alert players */
			//console.log('Player wins!');
			//window.client.testme(JSON.stringify(data));
		});
	}
	msgAccusationIncorrect()
	{
		this.socket.on('ACCUSATION_INCORRECT', function (data) {
			/* TODO: Alert players, set failed player to disabled state */
			//console.log('Accusation incorrect!');
			//window.client.testme(JSON.stringify(data));
		});
	}
	msgAccusationSolution()
	{
		this.socket.on('ACCUSATION_SOLUTION', function (data) {
			/* TODO: Alert players */
			//console.log('Solution:');
			//window.client.testme(JSON.stringify(data));
		});
	}
	msgTurnCompleteConfirmation()
	{
		this.socket.on('REQUEST_TURN_COMPLETE_CONFIRM', function () {
			//window.client.promptPlayer('PROMPT_END_TURN');
		});
	}
}


