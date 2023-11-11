/*
 * Abstract Representation of a GameHud ( Heads-up-Display )
 */
import { Button,Card,Alert,Weapon } from '/js/spaces.js';
import { WeaponConstants } from '/common/representations/weapon.mjs';
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
		this.alertAreaStartX = 0;
		this.alertAreaStartY = mapHeight;
		this.alertAreaHeight = 50;
		this.alertAreaWidth = screenWidth;
		this.characterNameAreaStartX = mapWidth
		this.characterNameAreaStartY = 0;
		this.characterNameAreaHeight = screenHeight/4;
		this.characterNameAreaWidth = screenWidth - mapWidth;
		this.cardAreaStartX = mapWidth;
		this.cardAreaStartY = this.characterNameAreaHeight;
		this.cardAreaHeight = screenHeight/2;
		this.cardAreaWidth = screenWidth - mapWidth;
		this.weaponAreaStartX = mapWidth;
		this.weaponAreaStartY = this.alertAreaStartY + this.alertAreaHeight;
		this.weaponAreaHeight = screenHeight/4 - this.alertAreaHeight;
		this.weaponAreaWidth = screenWidth - mapWidth;

		this.buttonMarginSFactor = .25;
		this.buttonGapSFactor = .125;

		this.cardMarginSFactor = .10;
		this.cardGapSFactor = .05;

		this.weaponMarginSFactor = .14;
		this.weaponGapSFactor = .02;

		this.alertMarginSFactor = .01;

		this.buttons = [];
		this.cards = [];
		this.alerts = [];
		this.weapons = [];
		this.createHud(state);
	}
	createHud(state)
	{
		this.createCards(state['cards']);
		this.createButtons(state['buttons']);
		this.createAlerts(state['alerts']);
		this.createWeapons();
	}
	createWeapons()
	{
		let weaponWidth = this.weaponAreaWidth - 2 * ( this.weaponMarginSFactor * this.weaponAreaWidth );
		let weaponGapCount = Object.keys(WeaponConstants).length - 1;
		let weaponGapTotalHeight = ( this.weaponAreaHeight * this.weaponGapSFactor ) * weaponGapCount;
		let weaponHeight = ((this.weaponAreaHeight - 2 * ( this.weaponMarginSFactor * this.weaponAreaHeight )) - weaponGapTotalHeight )/(weaponGapCount + 1);
		let weaponStartX = (this.weaponMarginSFactor * this.weaponAreaWidth) + this.weaponAreaStartX;
		let weaponStartY = (this.weaponMarginSFactor * this.weaponAreaHeight) + this.weaponAreaStartY;
		for(var weapon in WeaponConstants)
		{
			let weaponNew = new Weapon(weapon,weaponStartX,weaponStartY,weaponHeight,weaponWidth);
			weaponStartY += weaponHeight + (this.weaponAreaHeight * this.weaponGapSFactor);
			this.weapons.push(weaponNew);
		}
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
		let buttonAreaSFactorLW = this.buttonAreaHeight/this.buttonAreaWidth;
		let buttonHeight = this.buttonAreaHeight - 2 * ( this.buttonMarginSFactor * this.buttonAreaHeight );
		let buttonGapCount = state.length - 1;
		let buttonGapTotalWidth = ( this.buttonAreaWidth * this.buttonGapSFactor);
		let buttonWidth = ((this.buttonAreaWidth - 2 * ( this.buttonMarginSFactor/(buttonGapCount) * this.buttonAreaWidth )) - buttonGapTotalWidth )/state.length;
		let buttonStartX = (this.buttonMarginSFactor/(buttonGapCount) * this.buttonAreaWidth) + this.buttonAreaStartX;
		let buttonStartY = (this.buttonMarginSFactor * this.buttonAreaHeight) + this.buttonAreaStartY;
		state.forEach((b) => {
			let button = new Button(b['name'],b['content'],buttonStartX,buttonStartY,buttonHeight,buttonWidth);
			buttonStartX += buttonWidth + (this.buttonAreaWidth * this.buttonGapSFactor)/buttonGapCount;
			this.buttons.push(button);
		});
	}
	createAlerts(state)
	{
		this.alerts = [];
		let alertHeight = this.alertAreaHeight - 2 * ( this.alertMarginSFactor * this.alertAreaHeight );
		let alertWidth = this.alertAreaWidth;
		let alertStartX = this.alertAreaStartX;
		let alertStartY = (this.alertMarginSFactor * this.alertAreaHeight) + this.alertAreaStartY;
		state.forEach((a) => {
			let alertInfo = new Alert(a['name'],a['content'],alertStartX,alertStartY,alertHeight,alertWidth);
			alertStartX += alertWidth + (this.alertAreaWidth * this.alertGapSFactor);
			this.alerts.push(alertInfo);
		});
	}
}

