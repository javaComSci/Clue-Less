/*
 * Abstract Representation of a GameHud ( Heads-up-Display )
 */
import { Button,Card } from '/js/spaces.js';
export class GameHud
{
	constructor(mapHeight, mapWidth, screenHeight, screenWidth)
	{
		/*
		 * Define areas for the hud
		 */
		this.buttonAreaStartX = 0;
		this.buttonAreaStartY = mapHeight + 50;
		this.buttonAreaHeight = screenHeight - mapHeight;
		this.buttonAreaWidth = mapWidth;
		this.alertAreaStartX = mapWidth;
		this.alertAreaStartY = 0;
		this.alertAreaHeight = screenHeight/4;
		this.alertAreaWidth = screenWidth - mapWidth;
		this.cardAreaStartX = mapWidth;
		this.cardAreaStartY = this.alertAreaHeight;
		this.cardAreaHeight = 3 * screenHeight/4;
		this.cardAreaWidth = screenWidth - mapWidth;
		this.createHud();
	}
	createHud()
	{
		this.createCards();
		this.createButtons();
		this.createAlerts();
	}
	createCards()
	{
		/*
		state.forEach((card) => {
		});
		*/
	}
	createButtons()
	{
	}
	createAlerts()
	{
	}
}

