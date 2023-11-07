/*
 * Graphical implementation of a GameMap using PIXIJS
 */
import { GameMap } from '/js/gamemap.mjs';
import { GameHud } from '/js/gamehud.js';

export class PixiHud extends GameHud
{
	constructor(app, mapHeight, mapWidth, state)
	{
		super(mapHeight, mapWidth, app.renderer.view.height, app.renderer.view.width, state);
		this.app = app;
		this.displayHud();
	}
	displayHud()
	{
		this.displayCards();
		this.displayButtons();
		this.displayAlerts();
	}
	displayCards()
	{
		if ( this.cardContainer != null )
		{
			// free the memory!
			this.cardContainer.destroy();
		}
		this.cardContainer = new PIXI.Graphics();
		this.cardContainer.beginFill(0xFCFEB4);
		this.cardContainer.drawRect(this.cardAreaStartX,this.cardAreaStartY,this.cardAreaWidth,this.cardAreaHeight);
		this.cardContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Cards', {
				fontSize: 60,
				fill: 0x000000
			}
		);
		hudAreaText.x = this.cardAreaStartX + this.cardAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.cardAreaStartY;
		this.cardContainer.addChild(hudAreaText);
		this.cards.forEach((card) => {
			let pixiCard = new PIXI.Graphics();
			pixiCard.eventMode = 'static';
			pixiCard.on('pointerup', (event) => { window.client.testme(card.name); } );
			pixiCard.beginFill(0xFBF8FB);
			pixiCard.drawRect(0,0,card.width,card.length);
			pixiCard.endFill();
			let text = new PIXI.Text(
				'Type:' + card.type + '\n' + 'Name:' + card.name, {
					fontSize: 30,
					fill: 0x000000
				}
			);
			text.x = 0;
			text.y = 0;
			pixiCard.addChild(text);
			pixiCard.position.set(card.x,card.y);
			this.cardContainer.addChild(pixiCard);
		});
		this.app.stage.addChild(this.cardContainer);
	}
	displayButtons()
	{
		if ( this.buttonContainer != null )
		{
			// free the memory!
			this.buttonContainer.destroy();
		}
		this.buttonContainer = new PIXI.Graphics();
		this.buttonContainer.beginFill(0xCAFEB4);
		this.buttonContainer.drawRect(this.buttonAreaStartX,this.buttonAreaStartY,this.buttonAreaWidth,this.buttonAreaHeight);
		this.buttonContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Actions', {
				fontSize: 60,
				fill: 0x000000
			}
		);
		hudAreaText.x = this.buttonAreaStartX + this.buttonAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.buttonAreaStartY;
		this.buttonContainer.addChild(hudAreaText);
		this.buttons.forEach((button) => {
			let pixiButton = new PIXI.Graphics();
			pixiButton.eventMode = 'static';
			pixiButton.on('pointerup', (event) => { window.client.testme(button.name); } );
			pixiButton.beginFill(0xFBF8FB);
			pixiButton.drawRect(0,0,button.width,button.length);
			pixiButton.endFill();
			let text = new PIXI.Text(
				button.content, {
					fontSize: 40,
					fill: 0x000000
				}
			);
			text.x = button.length/2 - text.width/2;
			text.y = button.width/2 - text.height/2;
			pixiButton.addChild(text);
			pixiButton.position.set(button.x,button.y);
			this.buttonContainer.addChild(pixiButton);
		});
		this.app.stage.addChild(this.buttonContainer);
	}
	displayAlerts()
	{
		if ( this.alertContainer != null )
		{
			// free the memory!
			this.alertContainer.destroy();
		}
		this.alertContainer = new PIXI.Graphics();
		this.alertContainer.beginFill(0xFEE6B4);
		this.alertContainer.drawRect(this.alertAreaStartX,this.alertAreaStartY,this.alertAreaWidth,this.alertAreaHeight);
		this.alertContainer.endFill();
		this.alerts.forEach((alertInfo) => {
			let pixiAlert = new PIXI.Graphics();
			pixiAlert.eventMode = 'static';
			pixiAlert.on('pointerup', (event) => { window.client.testme(alertInfo.content); } );
			pixiAlert.beginFill(0xFBF8FB);
			pixiAlert.drawRect(0,0,alertInfo.width,alertInfo.length);
			pixiAlert.endFill();
			pixiAlert.position.set(alertInfo.x,alertInfo.y);
			this.alertContainer.addChild(pixiAlert);
		});
		this.app.stage.addChild(this.alertContainer);
	}
}

export class PixiMap extends GameMap
{
	constructor(app, height, width)
	{
		super(height, width);
		this.app = app;
		super.createMap();
		this.displayMap();
	}
	displayMap()
	{
		this.displayRooms();
		this.displayHallways();
		this.displayPassageways();
	}

	// TODO: Create a parent container that holds the rooms on the pixiMap
	/*
	displayRooms() {
		const rooms = new PIXI.Graphics();
		for(var room in this.rooms) {
			const rectangle = new PIXI.Rectangle(this.rooms[room].x,this.rooms[room].y,this.rooms[room].length,this.rooms[room].width);
			rooms.beginFill(0x66CCFF);
			// https://pixijs.download/release/docs/PIXI.Graphics.html#drawShape
			rooms.drawShape(rectangle);
			rooms.endFill();
			this.app.stage.addChild(rectangle);
		}
	}
	*/
	displayRooms() {
		for(var room in this.rooms) {
			const rectangle = new PIXI.Graphics();
			rectangle.beginFill(0x66CCFF);
			rectangle.drawRect(this.rooms[room].x,this.rooms[room].y,this.rooms[room].length,this.rooms[room].width);
			rectangle.endFill();
			rectangle.eventMode = 'static';
			rectangle.on('pointerup', (event) => { window.client.testme(); } );
			this.app.stage.addChild(rectangle);
			this.rooms[room].element = rectangle;
			const roomName = new PIXI.Text(room, { fontSize: 24, fill: 0xFBF8FB });
			roomName.x = this.rooms[room].x;
			roomName.y = this.rooms[room].y;
			rectangle.addChild(roomName);
		}
	}
	// TODO: Create a parent container that holds the hallways on the pixiMap
	displayHallways() {
		for(var hallway in this.hallways) {
			const rectangle = new PIXI.Graphics();
			rectangle.beginFill(0xD359DF);
			rectangle.drawRect(this.hallways[hallway].x,this.hallways[hallway].y,this.hallways[hallway].length,this.hallways[hallway].width);
			rectangle.endFill();
			this.app.stage.addChild(rectangle);
			this.hallways[hallway].element = rectangle;
		}
	}
	displayCharacters(playerCharacters) {
		if ( this.characterContainer != null )
		{
			// free the memory!
			this.characterContainer.destroy();
		}
		this.characterContainer = new PIXI.Graphics();
		playerCharacters.forEach((character) => {
			let charRep = this.characters[character['name']];
			let charX = this.locations[character['currentLocation']].playerLocationX;
			let charY = this.locations[character['currentLocation']].playerLocationY;

			let pixiCharacter = new PIXI.Graphics();
			pixiCharacter.eventMode = 'static';
			pixiCharacter.on('pointerup', (event) => { window.client.testme(character.name); } );
			pixiCharacter.beginFill(0xFBF8FB);
			pixiCharacter.drawRect(0,0,this.ce,this.ce);
			pixiCharacter.endFill();
			pixiCharacter.position.set(charX,charY);
			this.characterContainer.addChild(pixiCharacter);
		});
		this.app.stage.addChild(this.characterContainer);
	}
	displayPassageways() {
		if ( this.passagewayContainer != null )
		{
			// free the memory!
			this.passagewayContainer.destroy();
		}
		this.passagewayContainer = new PIXI.Graphics();
		for(var passageway in this.passageways) {
			let pixiPassageway = new PIXI.Graphics();
			let passagewayObj = this.passageways[passageway];
			pixiPassageway.eventMode = 'static';
			pixiPassageway.on('pointerup', (event) => { window.client.testme(passagewayObj.name); } );
			pixiPassageway.beginFill(0x1203FD);
			pixiPassageway.drawRect(0,0,this.pe,this.pe);
			pixiPassageway.endFill();
			pixiPassageway.position.set(passagewayObj.x,passagewayObj.y);
			this.passagewayContainer.addChild(pixiPassageway);
		}
		this.app.stage.addChild(this.passagewayContainer);
	}
}
