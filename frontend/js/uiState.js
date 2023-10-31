/*
 * Updates the UI
 */
import { PixiMap } from '/js/pixiview.js';

export class UIState
{
	constructor()
	{
		this.app = new PIXI.Application({ height: 1600, width: 1600});
		document.body.appendChild(this.app.view);
		this.initializeGame();
	}
	initializeGame()
	{
		this.piximap = new PixiMap(this.app);
	}
}
