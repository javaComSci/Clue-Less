/*
 * Updates the UI
 */
import { PixiMap } from '/js/pixiview.js';

export class UIState
{
	constructor()
	{
		this.app = new PIXI.Application({ height: 1200, width: 1200});
		document.body.appendChild(this.app.view);
		this.initializeGame();
	}
	initializeGame()
	{
		this.piximap = new PixiMap(this.app);
	}
}
