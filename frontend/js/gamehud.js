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
		this.cardAreaStartX = 0;
		this.cardAreaStartY = mapHeight + 50;
		this.cardAreaHeight = screenHeight - mapHeight;
		this.cardAreaWidth = mapWidth;
		this.alertAreaStartX = 0;
		this.alertAreaStartY = mapHeight;
		this.alertAreaHeight = 50;
		this.alertAreaWidth = screenWidth;
		this.characterNameAreaStartX = mapWidth
		this.characterNameAreaStartY = 0;
		this.characterNameAreaHeight = screenHeight/4;
		this.characterNameAreaWidth = screenWidth - mapWidth;
		this.buttonAreaStartX = mapWidth;
		this.buttonAreaStartY = this.characterNameAreaHeight;
		this.buttonAreaHeight = screenHeight/3;
		this.buttonAreaWidth = screenWidth - mapWidth;
		this.weaponAreaStartX = mapWidth;
		this.weaponAreaStartY = this.alertAreaStartY + this.alertAreaHeight;
		this.weaponAreaHeight = screenHeight/4 - this.alertAreaHeight;
		this.weaponAreaWidth = screenWidth - mapWidth;

		this.buttonMarginSFactorX = .20;
		this.buttonMarginSFactorY = .10;
		this.buttonGapSFactor = .02;

		this.cardMarginSFactorX = .20;
		this.cardMarginSFactorY = .20;
		this.cardGapSFactor = .05;
		this.cardSizingFactor = 5;

		this.weaponMarginSFactor = .15;
		this.weaponGapSFactor = .03;

		this.alertMarginSFactor = .01;

		this.avatarMarginSFactorX = .20;
		this.avatarMarginSFactorY = .17;

		this.buttons = [];
		this.cards = [];
		this.alerts = [];
		this.weapons = [];
		this.avatar = '';
		this.createHud(state);
	}
	createHud(state)
	{
		this.createCards(state['cards']);
		this.createButtons(state['buttons']);
		this.createAlerts(state['alerts']);
		this.createAvatar(state['characterName']);
		this.createWeapons();
	}
	createWeapons()
	{
		let rows = 2;
		let columns = 3;
		let weaponGapCount = Object.keys(WeaponConstants).length - 1;
		let weaponGapTotalWidth = ( this.weaponAreaHeight * this.weaponGapSFactor ) * rows;
		let weaponWidth = (this.weaponAreaWidth - 2 * ( this.weaponMarginSFactor * this.weaponAreaWidth ) - weaponGapTotalWidth)/columns;
		let weaponGapTotalHeight = ( this.weaponAreaHeight * this.weaponGapSFactor );
		let weaponHeight = ((this.weaponAreaHeight - 2 * ( this.weaponMarginSFactor * this.weaponAreaHeight )) - weaponGapTotalHeight )/rows;
		let weaponStartX = (this.weaponMarginSFactor * this.weaponAreaWidth) + this.weaponAreaStartX;
		let weaponStartY = (this.weaponMarginSFactor * this.weaponAreaHeight) + this.weaponAreaStartY;
		let weaponCount = 1;
		for(var weapon in WeaponConstants)
		{
			let weaponNew = new Weapon(weapon,weaponStartX,weaponStartY,weaponHeight,weaponWidth);
			this.weapons.push(weaponNew);
			if( weaponCount % columns == 0 )
			{
				weaponStartY += weaponHeight + (this.weaponAreaHeight * this.weaponGapSFactor);
				weaponStartX = (this.weaponMarginSFactor * this.weaponAreaWidth) + this.weaponAreaStartX;
			}
			else
			{
				weaponStartX += weaponWidth + weaponGapTotalWidth/rows;
			}
			weaponCount += 1;
		}
	}
	createAvatar(name)
	{
		let avatarHeight = this.characterNameAreaHeight - 2 * ( this.avatarMarginSFactorY * this.characterNameAreaHeight );
		let avatarWidth = this.characterNameAreaWidth - 2 * ( this.avatarMarginSFactorX * this.characterNameAreaWidth );
		let avatarStartX = this.characterNameAreaStartX + (this.avatarMarginSFactorX * this.characterNameAreaWidth);
		let avatarStartY = this.characterNameAreaStartY + (this.avatarMarginSFactorY * this.characterNameAreaHeight);
		let avatarRep = new Card(name,name,'avatar',avatarStartX,avatarStartY,avatarHeight,avatarWidth);
		this.avatar = avatarRep;
	}
	createCards(state)
	{
		let cardHeight = this.cardAreaHeight - 2 * ( this.cardMarginSFactorY * this.cardAreaHeight );
		let cardGapCount = state.length - 1;
		let cardGapTotalWidth = ( this.cardAreaWidth * this.cardGapSFactor ) * cardGapCount;
		let cardWidth = (this.cardAreaWidth - 2 * ( this.cardMarginSFactorX * this.cardAreaWidth ))/this.cardSizingFactor;
		let cardStartX = this.cardAreaWidth/2 - ( cardGapTotalWidth + (cardWidth * state.length))/2;
		//let cardStartX = (this.cardMarginSFactorX/(cardGapCount) * this.cardAreaWidth) + this.cardAreaStartX;
		let cardStartY = (this.cardMarginSFactorY * this.cardAreaHeight) + this.cardAreaStartY;
		state.forEach((c) => {
			let card = new Card(c['name'],c['name'],c['type'],cardStartX,cardStartY,cardHeight,cardWidth);
			cardStartX += cardWidth + this.cardAreaWidth * this.cardGapSFactor;
			this.cards.push(card);
		});
	}
	createButtons(state)
	{
		let buttonAreaSFactorLW = this.buttonAreaHeight/this.buttonAreaWidth;
		let buttonWidth = this.buttonAreaWidth - 2 * ( this.buttonMarginSFactorX * this.buttonAreaWidth );
		let buttonGapCount = state.length - 1;
		let buttonGapTotalHeight = ( this.buttonAreaHeight * this.buttonGapSFactor);
		let buttonHeight = ((this.buttonAreaHeight - 2 * ( this.buttonMarginSFactorY * this.buttonAreaHeight )) - buttonGapTotalHeight )/state.length;
		let buttonStartX = (this.buttonMarginSFactorX * this.buttonAreaWidth) + this.buttonAreaStartX;
		let buttonStartY = (this.buttonMarginSFactorY * this.buttonAreaHeight) + this.buttonAreaStartY;
		state.forEach((b) => {
			let button = new Button(b['name'],b['content'],buttonStartX,buttonStartY,buttonHeight,buttonWidth);
			buttonStartY += buttonHeight + (this.buttonAreaHeight * this.buttonGapSFactor);
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

