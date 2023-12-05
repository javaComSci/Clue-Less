/*
 * Communicates with the Game Engine on behalf of the UI
 */
import "/socket.io/socket.io.js";
import { EngineSend } from "/js/engineSend.js";
import { EngineRecv } from "/js/engineRecv.js";

export class EngineComm {
	constructor() {
		//initialize socket
		this.socket = io();
		this.sender = new EngineSend(this.socket);
		this.receiver = new EngineRecv(this.socket);
	}
	send(action, data)
	{
		this.sender.msg(action, data);
	}
	sendWithCallback(action, data, callback)
	{
		this.sender.pushMsgWithCallback(action, data, callback);
	}
}
