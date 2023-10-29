/*
 * Communicates with the Game Engine on behalf of the UI
 */
//import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { EngineSend } from "/js/engineSend.js";
import { EngineRecv } from "/js/engineRecv.js";

export class EngineComm {
	constructor() {
		//initialize socket
		this.socket = '';
		this.sender = new EngineSend(this.socket);
		this.receiver = new EngineRecv(this.socket);
	}
	send(action, data)
	{
		this.sender.msg(action, data);
	}
}
