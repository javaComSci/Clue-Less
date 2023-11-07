/*
 * Updates the UI
 */
import { PixiMap,PixiHud } from '/js/pixiview.js';

export class UIState
{
	constructor()
	{
		this.app = new PIXI.Application({ height: 1600, width: 1600});
		document.body.appendChild(this.app.view);
		this.mapHeight = this.app.renderer.view.height-400;
		this.mapWidth = this.app.renderer.view.width-400;

		/*
		 * set starting state for some elements
		 */
		this.state = {
			'buttons': [ {'name':'Suggestion','content':'Suggestion'},
				{'name':'Accusation','content':'Accusation'} ],
			'cards':[],
			'alerts': [ {'name':'pending','content':'Waiting on 2 more players'}]
		};
		//let hudState = { 'buttons': this.buttons, 'alerts': this.alerts, 'cards': state['cards'] };
		this.initializeGame(this.state)
	}
	initializeGame(state)
	{
		this.piximap = new PixiMap(this.app, this.mapHeight, this.mapWidth);
		this.pixihud = new PixiHud(this.app, this.mapHeight, this.mapWidth, state);
	}
	updateHudState(state)
	{
		this.pixihud.createCards(state['cards']);
		this.pixihud.displayCards();
	}
	updateMapState(state)
	{
		console.log(state['characterPieces']);
		this.piximap.displayCharacters(state['characterPieces']);
	}
}
