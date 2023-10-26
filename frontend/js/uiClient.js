/*
 * Interface ( facade ) between the user and the UI. Communicates actions to UI in accordance with game engine.
 */
//import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { EngineSend } from "/js/engineSend.js";
import { UIAction } from "/js/uiAction.js";
export class UIClient
{
	constructor()
	{
		//this.socket = io();
		this.socket = '';
		this.action = new UIAction();
		this.engine = new EngineSend(this.socket);
		/*
		 * Listens for events from game engine
		 */
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
		/*
		 * TODO: Listens for events from user
		 */
		/*
		this.domListeners = {
			'room' : this.clickRoom
		}
		*/
		this.initializeListeners();

	}
	initializeListeners()
	{
		for( var msg in this.socketRecvMessages )
		{
			this.socketRecvMessages[msg]();
		}
		/* TODO
		for( var element in domListeners )
		{
			document.getElementById(element).onClick = domListeners[element];
		}
		*/
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


/*
 * non-implemented code saved for future reference
/*
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.resizeTo = window;
*/
//PIXI.Assets.loader('assets/gamemap.png');

//const gamemap = PIXI.Sprite.from("/assets/gamemap.png");
/*
const rectangle = new PIXI.Graphics();
rectangle.beginFill(0x66CCFF);
rectangle.drawRect(Mb,Mb,Re,Re);
rectangle.endFill();
app.stage.addChild(rectangle);
//app.stage.addChild(gamemap);
*/
/*
const map = PIXI.Sprite.from("/assets/gamemap.png");
map.width = Re;
map.height = Re;
room_rectangles[0].mask = map;*/


