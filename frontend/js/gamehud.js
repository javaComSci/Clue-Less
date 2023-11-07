/*
 * Abstract Representation of a GameHud ( Heads-up-Display )
 */
import { Button,Card,Alert } from '/js/spaces.js';
export class GameHud
{
	constructor(mapHeight, mapWidth, screenHeight, screenWidth, state)
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

		this.buttonMarginSFactor = .25;
		this.buttonGapSFactor = .125;

		this.cardMarginSFactor = .10;
		this.cardGapSFactor = .05;

		this.alertMarginSFactor = .25;

		this.buttons = [];
		this.cards = [];
		this.alerts = [];
		this.createHud(state);
	}
	createHud(state)
	{
		this.createCards(state['cards']);
		this.createButtons(state['buttons']);
		this.createAlerts(state['alerts']);
	}
	createCards(state)
	{
		let cardWidth = this.cardAreaWidth - 2 * ( this.cardMarginSFactor * this.cardAreaWidth );
		let cardGapCount = state.length - 1;
		let cardGapTotalHeight = ( this.cardAreaHeight * this.cardGapSFactor ) * cardGapCount;
		let cardHeight = ((this.cardAreaHeight - 2 * ( this.cardMarginSFactor * this.cardAreaHeight )) - cardGapTotalHeight )/state.length;
		let cardStartX = (this.cardMarginSFactor * this.cardAreaWidth) + this.cardAreaStartX;
		let cardStartY = (this.cardMarginSFactor * this.cardAreaHeight) + this.cardAreaStartY;
		state.forEach((c) => {
			let card = new Card(c['name'],c['name'],c['type'],cardStartX,cardStartY,cardHeight,cardWidth);
			cardStartY += cardHeight + (this.cardAreaHeight * this.cardGapSFactor);
			this.cards.push(card);
		});
	}
	createButtons(state)
	{
		let buttonHeight = this.buttonAreaHeight - 2 * ( this.buttonMarginSFactor * this.buttonAreaHeight );
		let buttonGapCount = state.length - 1;
		let buttonGapTotalWidth = ( this.buttonAreaWidth * this.buttonGapSFactor ) * buttonGapCount;
		let buttonWidth = ((this.buttonAreaWidth - 2 * ( this.buttonMarginSFactor * this.buttonAreaWidth )) - buttonGapTotalWidth )/state.length;
		let buttonStartX = (this.buttonMarginSFactor * this.buttonAreaWidth) + this.buttonAreaStartX;
		let buttonStartY = (this.buttonMarginSFactor * this.buttonAreaHeight) + this.buttonAreaStartY;
		state.forEach((b) => {
			let button = new Button(b['name'],b['content'],buttonStartX,buttonStartY,buttonHeight,buttonWidth);
			buttonStartX += buttonWidth + (this.buttonAreaWidth * this.buttonGapSFactor);
			this.buttons.push(button);
		});
	}
	createAlerts(state)
	{
		let alertHeight = this.alertAreaHeight - 2 * ( this.alertMarginSFactor * this.alertAreaHeight );
		let alertWidth = this.alertAreaWidth - 2 * ( this.alertMarginSFactor * this.alertAreaWidth );
		let alertStartX = (this.alertMarginSFactor * this.alertAreaWidth) + this.alertAreaStartX;
		let alertStartY = (this.alertMarginSFactor * this.alertAreaHeight) + this.alertAreaStartY;
		state.forEach((a) => {
			let alertInfo = new Alert(a['name'],a['content'],alertStartX,alertStartY,alertHeight,alertWidth);
			alertStartX += alertWidth + (this.alertAreaWidth * this.alertGapSFactor);
			this.alerts.push(alertInfo);
		});
	}
}

