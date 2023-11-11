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
		if( state['cards'] != undefined )
		{
			this.pixihud.createCards(state['cards']);
			this.pixihud.displayCards();
		}
		if( state['alerts'] != undefined )
		{
			this.pixihud.createAlerts(state['alerts']);
			this.pixihud.displayAlerts();
		}
		if( state['characterName'] != undefined )
		{
			this.pixihud.displayCharacterName(state['characterName']);
		}
	}
	updateMapState(state)
	{
		if( state['characterPieces'] != undefined )
		{
			this.piximap.displayCharacters(state['characterPieces']);
		}
	}
}
