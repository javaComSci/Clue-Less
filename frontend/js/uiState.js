/*
 * Updates the UI
 */
import { PixiMap } from '/js/pixiview.js';

export class UIState
{
	constructor(app)
	{
		document.body.appendChild(app.view);
		this.initializeGame(app);
	}
	initializeGame(app)
	{
		this.piximap = new PixiMap(app);
	}
}
