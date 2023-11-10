/*
 * Performs an action on the UI
 */
import { UIState } from '/js/uiState.js';
import { GameAlerts } from '/js/alerts.js';

export class UIManager
{
	constructor()
	{
		this.gameAlerts = new GameAlerts();
		this.defaultStateUI = {
			'buttons': [ {'name':'SUGGESTION','content':'Suggestion'},
				{'name':'ACCUSATION','content':'Accusation'},
				{'name':'PASS','content':'Pass'},
				{'name':'END_TURN','content':'End Turn'}],
			'cards':[],
			'alerts': []
		};
		this.defaultStateMap = {};
		this.currentStateUI = this.defaultStateUI;
		this.currentStateMap = this.defaultStateMap;
		this.ui = new UIState({'ui':this.currentStateUI,'map':this.currentStateMap});
		this.messageUser('INFO_CLIENT_JOINED');
	}
	/*
	 * Methods to be defined
	 */
	updateGameState(state)
	{
		let newStateUI = {};
		let newStateMap = {};
		if( state['cards'] != undefined )
		{
			newStateUI['cards'] = state['cards'];
		}
		if( state['alerts'] != undefined )
		{
			newStateUI['alerts'] = state['alerts'];
		}
		if( state['characterPieces'] != undefined )
		{
			newStateMap['characterPieces'] = state['characterPieces'];
		}
		this.ui.updateHudState(newStateUI);
		this.ui.updateMapState(newStateMap);
	}
	move()
	{
	}
	suggestion()
	{
	}
	accusation()
	{
	}
	gameend()
	{
	}
	messageUser(msg, data)
	{
		//this.ui.updateHudState(state);
		console.log(msg);
		//this.gameAlerts.generateAlert(msg);
		this.updateGameState(this.gameAlerts.generateAlert(msg, data));
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


