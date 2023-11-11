/*
 * Graphical implementation of a GameMap using PIXIJS
 */
import { GameMap } from '/js/gamemap.mjs';
import { GameHud } from '/js/gamehud.js';
import { CharacterConstants } from '../../common/representations/character.mjs'; 

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
		this.displayWeapons();
		this.displayCharacterName();
	}
	displayCharacterName(text)
	{
		if ( this.charNameContainer != null )
		{
			// free the memory!
			this.charNameContainer.destroy();
		}
		if ( text == undefined )
		{
			text = 'initializing...'
		}
		this.charNameContainer = new PIXI.Graphics();
		this.charNameContainer.beginFill(0x0B355E);
		this.charNameContainer.drawRect(this.characterNameAreaStartX,this.characterNameAreaStartY,this.characterNameAreaWidth,this.characterNameAreaHeight);
		this.charNameContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Character:\n' + text, {
				fontSize: 60,
				fill: 0xffffff
			}
		);
		hudAreaText.x = this.characterNameAreaStartX + this.characterNameAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.characterNameAreaStartY;
		this.charNameContainer.addChild(hudAreaText);
		this.app.stage.addChild(this.charNameContainer);
	}
	displayWeapons()
	{
		if ( this.weaponContainer != null )
		{
			// free the memory!
			this.weaponContainer.destroy();
		}
		this.weaponContainer = new PIXI.Graphics();
		this.weaponContainer.beginFill(0x0B355E);
		this.weaponContainer.drawRect(this.weaponAreaStartX,this.weaponAreaStartY,this.weaponAreaWidth,this.weaponAreaHeight);
		this.weaponContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Weapons', {
				fontSize: 45,
				fill: 0xffffff
			}
		);
		hudAreaText.x = this.weaponAreaStartX + this.weaponAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.weaponAreaStartY;
		this.weaponContainer.addChild(hudAreaText);
		this.weapons.forEach((weapon) => {
			let pixiWeapon = new PIXI.Graphics();
			pixiWeapon.eventMode = 'static';
			pixiWeapon.on('pointerup', (event) => { window.client.selectWeapon(weapon.name); } );
			pixiWeapon.beginFill(0xFBF8FB);
			pixiWeapon.drawRect(0,0,weapon.width,weapon.length);
			pixiWeapon.endFill();
			let text = new PIXI.Text(
				weapon.name, {
					fontSize: 30,
					fill: 0x000000
				}
			);
			text.x = 0;
			text.y = 0;
			pixiWeapon.addChild(text);
			pixiWeapon.position.set(weapon.x,weapon.y);
			this.weaponContainer.addChild(pixiWeapon);
		});
		this.app.stage.addChild(this.weaponContainer);
	}
	displayCards()
	{
		if ( this.cardContainer != null )
		{
			// free the memory!
			this.cardContainer.destroy();
		}
		this.cardContainer = new PIXI.Graphics();
		this.cardContainer.beginFill(0x247BA0);
		this.cardContainer.drawRect(this.cardAreaStartX,this.cardAreaStartY,this.cardAreaWidth,this.cardAreaHeight);
		this.cardContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Cards', {
				fontSize: 60,
				fill: 0xFFFFFF
			}
		);
		hudAreaText.x = this.cardAreaStartX + this.cardAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.cardAreaStartY;
		this.cardContainer.addChild(hudAreaText);
		this.cards.forEach((card) => {
			let pixiCard = new PIXI.Graphics();
			pixiCard.eventMode = 'static';
			pixiCard.on('pointerup', (event) => { window.client.selectCard(card.name, card.type); } );
			pixiCard.beginFill(0xFBF8FB);
			pixiCard.drawRect(0,0,card.width,card.length);
			pixiCard.endFill();
			let text = new PIXI.Text(
				'Type:' + card.type + '\n' + 'Name:' + card.name, {
					fontSize: 25,
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
		this.buttonContainer.beginFill(0x247BA0);
		this.buttonContainer.drawRect(this.buttonAreaStartX,this.buttonAreaStartY,this.buttonAreaWidth,this.buttonAreaHeight);
		this.buttonContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Actions', {
				fontSize: 60,
				fill: 0xffffff
			}
		);
		hudAreaText.x = this.buttonAreaStartX + this.buttonAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.buttonAreaStartY;
		this.buttonContainer.addChild(hudAreaText);
		this.buttons.forEach((button) => {
			let pixiButton = new PIXI.Graphics();
			pixiButton.eventMode = 'static';
			pixiButton.on('pointerup', (event) => { window.client.selectButton(button.name); } );
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
		this.alertContainer.beginFill(0x0B355E);
		this.alertContainer.drawRect(this.alertAreaStartX,this.alertAreaStartY,this.alertAreaWidth,this.alertAreaHeight);
		this.alertContainer.endFill();
		this.alerts.forEach((alertInfo) => {
			let pixiAlert = new PIXI.Graphics();
			pixiAlert.eventMode = 'static';
			pixiAlert.on('pointerup', (event) => { window.client.testme(alertInfo.content); } );
			pixiAlert.beginFill(0xFBF8FB);
			pixiAlert.drawRect(0,0,alertInfo.width,alertInfo.length);
			pixiAlert.endFill();
			let text = new PIXI.Text(
				alertInfo.content, {
					fontSize: 20,
					fill: 0x000000
				}
			);
			text.x = alertInfo.x + alertInfo.width/2 - text.width/2;
			text.y = 0;
			pixiAlert.addChild(text);
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
	displayRooms() {
		if ( this.roomContainer != null )
		{
			// free the memory!
			this.roomContainer.destroy();
		}
		this.roomContainer = new PIXI.Graphics();
		for(var room in this.rooms) {
			const pixiRoom = new PIXI.Graphics();
			let roomObj = this.rooms[room];
			let roomX = roomObj.x;
			let roomY = roomObj.y;

			pixiRoom.beginFill(0x247BA0);
			pixiRoom.drawRect(0,0,roomObj.width,roomObj.length);
			pixiRoom.endFill();
			pixiRoom.eventMode = 'static';
			pixiRoom.on('pointerup', (event) => { window.client.selectRoom(roomObj.name); } );
			pixiRoom.position.set(roomX,roomY);
			this.rooms[room].element = pixiRoom;

			const roomName = new PIXI.Text(room, { fontSize: 24, fill: 0xFBF8FB });
			roomName.x = 0;
			roomName.y = 0;
			pixiRoom.addChild(roomName);
			this.roomContainer.addChild(pixiRoom);
		}
		this.app.stage.addChild(this.roomContainer);
	}
	// TODO: Create a parent container that holds the hallways on the pixiMap
	displayHallways() {
		if ( this.hallwayContainer != null )
		{
			// free the memory!
			this.hallwayContainer.destroy();
		}
		this.hallwayContainer = new PIXI.Graphics();
		for(var hallway in this.hallways) {
			const pixiHallway = new PIXI.Graphics();
			let hallwayObj = this.hallways[hallway];
			let hallwayX = hallwayObj.x;
			let hallwayY = hallwayObj.y;

			pixiHallway.beginFill(0xE8F1F2)
			pixiHallway.drawRect(0,0,hallwayObj.length,hallwayObj.width);
			pixiHallway.endFill();
			pixiHallway.eventMode = 'static';
			pixiHallway.on('pointerup', (event) => { window.client.selectHallway(hallwayObj.name); } );
			pixiHallway.position.set(hallwayX,hallwayY);
			this.hallways[hallway].element = pixiHallway;
			this.hallwayContainer.addChild(pixiHallway);
		}
		this.app.stage.addChild(this.hallwayContainer);
	}
	displayCharacters(playerCharacters) {
		// reset number of occupants in each location
		for( var loc in this.locations )
		{
			this.locations[loc].resetOccupants();
		}
		if ( this.characterContainer != null )
		{
			// free the memory!
			this.characterContainer.destroy();
		}
		this.characterContainer = new PIXI.Graphics();
		playerCharacters.forEach((character) => {
			let charRep = this.characters[character['name']];
			let coordinates = this.locations[character['currentLocation']].getPlayerLocation();
			let charX = coordinates['x'];
			let charY = coordinates['y'];

			let pixiCharacter = new PIXI.Graphics();
			pixiCharacter.eventMode = 'static';
			pixiCharacter.on('pointerup', (event) => { window.client.selectPlayer(character.name); } );

			switch (character.name)
			{
				case CharacterConstants.SCARLET:
					pixiCharacter.beginFill(0xbe3228);
					break;
				case CharacterConstants.GREEN:
					pixiCharacter.beginFill(0x02e107);
					break;
				case CharacterConstants.MUSTARD:
					pixiCharacter.beginFill(0xFFFF00);
					break;
				case CharacterConstants.WHITE:
					pixiCharacter.beginFill(0xffffff);
					break;
				case CharacterConstants.PEACOCK:
					pixiCharacter.beginFill(0x0000FF);
					break;
				case CharacterConstants.PLUM:
					pixiCharacter.beginFill(0x800080);
					break;	
			}	
				
			// pixiCharacter.beginFill(0xFBF8FB);
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
			pixiPassageway.beginFill(0x13293D);
			pixiPassageway.drawRect(0,0,this.pe,this.pe);
			pixiPassageway.endFill();
			pixiPassageway.position.set(passagewayObj.x,passagewayObj.y);
			this.passagewayContainer.addChild(pixiPassageway);
		}
		this.app.stage.addChild(this.passagewayContainer);
	}
}
