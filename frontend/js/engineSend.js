/*
 * Interfaces between the UI and the GameEngine
 */
export class EngineSend {
	constructor(socket) {
		this.socket = socket;
		this.socketSendMessages = {
			'move' 			: this.msgMove,
			'suggestion' 	: this.msgSuggestion,
			'accuse'		: this.msgAccuse,
			'proof'			: this.msgProof,
			'start'			: this.msgStart
		}
	}
	msg(action, data)
	{
		this.socketSendMessages[action](data);
	}
	/*
	 * Private, pushes data to backend
	 */
	push(msg, data)
	{
		this.socket.emit(msg, data)
	}
	/*
	 * Stubs. Perform logic on event and then push data to backend
	 */
	msgMove(data)
	{
	}
	msgSuggestion(data)
	{
	}
	msgAccuse(data)
	{
	}
	msgProof(data)
	{
	}
	msgStart(data)
	{
	}

}
