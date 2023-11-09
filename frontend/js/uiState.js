/*
 * Updates the UI
 */
import { PixiMap,PixiHud } from '/js/pixiview.js';

export class UIState
{
	constructor(state)
	{
		this.app = new PIXI.Application({ height: 1600, width: 1600});
		document.body.appendChild(this.app.view);
		this.mapHeight = this.app.renderer.view.height-400;
		this.mapWidth = this.app.renderer.view.width-400;
		this.initializeGame(state)
	}
	initializeGame(state)
	{
		this.piximap = new PixiMap(this.app, this.mapHeight, this.mapWidth);
		this.pixihud = new PixiHud(this.app, this.mapHeight, this.mapWidth, state['ui']);
	}
	updateHudState(state)
	{
		this.pixihud.createCards(state['cards']);
		this.pixihud.displayCards();
	}
	updateMapState(state)
	{
		this.piximap.displayCharacters(state['characterPieces']);
	}
}
