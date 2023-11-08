/*
 * Interfaces between the UI and the Game Engine
 */
export class EngineSend {
	constructor(socket) {
		this.socket = socket;
		this.socketSendMessages = {
			'move' 			: this.msgMove.bind(this),
			'suggestion' 	: this.msgSuggestion.bind(this),
			'accuse'		: this.msgAccuse.bind(this),
			'proof'			: this.msgProof.bind(this),
			'start'			: this.msgStart.bind(this),
			'turncomplete'	: this.msgEndTurn.bind(this)
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
		this.socket.emit(msg, data);
	}
	/*
	 * Stubs. Perform logic on event and then push data to backend
	 */
	msgMove(data)
	{
		this.push('move', data);
	}
	msgSuggestion(data)
	{
		this.push('suggestion', data);
	}
	msgAccuse(data)
	{
	}
	msgProof(data)
	{
	}
	msgStart(data)
	{
		this.push('start', data);
	}
	msgEndTurn(data)
	{
		this.push('turncomplete', data);
	}
}
