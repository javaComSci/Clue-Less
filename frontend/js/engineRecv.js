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
			'GAME_PLAYERS' 	        			: this.msgPlayers.bind(this),
			'SHOW_GAME_BOARD'					: this.msgShowGameBoard.bind(this),
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
	msgPlayers()
	{
		this.socket.on('GAME_PLAYERS', function (obj) {
			window.client.displayWaitRoom(obj);
		});
	}
	msgShowGameBoard()
	{
		this.socket.on('SHOW_GAME_BOARD', function (obj) {
			window.client.displayGameBoard(obj);
		});
	}
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
			window.client.setPlayerTurn(obj);
		});
	}
	msgRequestingProofBroadcast()
	{
		this.socket.on('REQUESTING_PROOF_BROADCAST', function (obj) {
			window.client.promptPlayer('INFO_REQUESTING_PROOF_BROADCAST');
		});
	}
	msgRequestingMove()
	{
		this.socket.on('REQUEST_MOVE', function (obj) {
			window.client.setMove(obj);
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
		this.socket.on('REQUEST_PROOF', function (data) {
			window.client.requestProof(data);
		});
	}
	msgIsProofProvided()
	{
		this.socket.on('IS_PROOF_PROVIDED', function (data) {
			window.client.checkProofProvided(data['isProofProvided']);
		});
	}
	msgProofProvided()
	{
		this.socket.on('PROOF_PROVIDED', function ({proofProviderPlayerId}) {
			window.client.receiveProof(proofProviderPlayerId);
		});
	}
	msgAccusationCorrect()
	{
		this.socket.on('ACCUSATION_CORRECT', function (data) {
			window.client.playerWins(data);
		});
	}
	msgAccusationIncorrect()
	{
		this.socket.on('ACCUSATION_INCORRECT', function (data) {
			window.client.playerLoses(data);
		});
	}
	msgAccusationSolution()
	{
		this.socket.on('ACCUSATION_SOLUTION', function (data) {
			window.client.accusationSolution(data);
		});
	}
	msgTurnCompleteConfirmation()
	{
		this.socket.on('REQUEST_TURN_COMPLETE_CONFIRM', function () {
			window.client.setTurnComplete();
		});
	}
}


