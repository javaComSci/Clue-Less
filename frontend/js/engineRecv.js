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
			'insufficientPlayerCount' 	: this.msgInsufficientPlayerCount,
			'PLAYER_START_INFO' 		: this.msgPlayerStartInfo,
			'GAME_STATE' 				: this.msgGameState,
			'REQUESTING_MOVE_BROADCAST' : this.msgRequestingMoveBroadcast,
			'REQUEST_MOVE'				: this.msgRequestingMove,
			'REQUEST_SUGGESTION'		: this.msgRequestSuggestion,
			'REQUEST_PROOF'				: this.msgRequestProof,
			'IS_PROOF_PROVIDED'			: this.msgIsProofProvided,
			'PROOF_PROVIDED'			: this.msgProofProvided,
			'ACCUSATION_CORRECT'		: this.msgAccusationCorrect
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
	}
	msgPlayerStartInfo()
	{
	}
	msgGameState()
	{
	}
	msgRequestingMoveBroadcast()
	{
	}
	msgRequestingMove()
	{
	}
	msgRequestSuggestion()
	{
	}
	msgRequestProof()
	{
	}
	msgIsProofProvided()
	{
	}
	msgProofProvided()
	{
	}
	msgAccusationCorrect()
	{
	}
}


