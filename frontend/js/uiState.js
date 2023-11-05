/*
 * Updates the UI
 */
import { PixiMap } from '/js/pixiview.js';
import { PixiHud } from '/js/pixiview.js';

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
		this.buttons = [ 'Suggestion', 'Accusation' ];
		this.alerts = 'Starting...';
		//let hudState = { 'buttons': this.buttons, 'alerts': this.alerts, 'cards': state['cards'] };
		this.initializeGame()
	}
	initializeGame()
	{
		this.piximap = new PixiMap(this.app, this.mapHeight, this.mapWidth);
		this.pixihud = new PixiHud(this.app, this.mapHeight, this.mapWidth);
	}
	updateHud(state)
	{
		state['buttons'] = this.buttons;
	}
	updateMap(state)
	{
	}
}
