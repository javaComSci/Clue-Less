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
	async loadAssets()
	{
		let cards = {
			"frames": {
				"CARD_WHITE":
				{
					"frame": {'x':20,'y':17,'w':84,'h':146}
				},
				"CARD_PEACOCK":
				{
					"frame": {'x':120,'y':17,'w':84,'h':146}
				},
				"CARD_SCARLET":
				{
					"frame": {'x':220,'y':17,'w':84,'h':146}
				},
				"CARD_MUSTARD":
				{
					"frame": {'x':320,'y':17,'w':84,'h':146}
				},
				"CARD_GREEN":
				{
					"frame": {'x':420,'y':17,'w':84,'h':146}
				},
				"CARD_PLUM":
				{
					"frame": {'x':520,'y':17,'w':84,'h':146}
				},
				"CARD_CANDLESTICK":
				{
					"frame": {'x':20,'y':169,'w':84,'h':146}
				},
				"CARD_REVOLVER":
				{
					"frame": {'x':120,'y':169,'w':84,'h':146}
				},
				"CARD_ROPE":
				{
					"frame": {'x':220,'y':169,'w':84,'h':146}
				},
				"CARD_WRENCH":
				{
					"frame": {'x':320,'y':169,'w':84,'h':146}
				},
				"CARD_PIPE":
				{
					"frame": {'x':420,'y':169,'w':84,'h':146}
				},
				"CARD_KNIFE":
				{
					"frame": {'x':520,'y':169,'w':84,'h':146}
				},
				"CARD_STUDY":
				{
					"frame": {'x':20,'y':321,'w':84,'h':146}
				},
				"CARD_LIBRARY":
				{
					"frame": {'x':120,'y':321,'w':84,'h':146}
				},
				"CARD_CONSERVATORY":
				{
					"frame": {'x':220,'y':321,'w':84,'h':146}
				},
				"CARD_HALL":
				{
					"frame": {'x':320,'y':321,'w':84,'h':146}
				},
				"CARD_KITCHEN":
				{
					"frame": {'x':420,'y':321,'w':84,'h':146}
				},
				"CARD_BALLROOM":
				{
					"frame": {'x':20,'y':473,'w':84,'h':146}
				},
				"CARD_LOUNGE":
				{
					"frame": {'x':120,'y':473,'w':84,'h':146}
				},
				"CARD_BILLIARDROOM":
				{
					"frame": {'x':220,'y':473,'w':84,'h':146}
				},
				"CARD_DININGROOM":
				{
					"frame": {'x':320,'y':473,'w':84,'h':146}
				},
			},
			"meta": {
				"image": "/assets/gamepieces.jpg",
				"format": "RGBA8888",
				"size": {"w":640,"h":620},
				"scale": 1
			}
		};
		this.spriteSheet = new PIXI.Spritesheet(
			PIXI.BaseTexture.from(cards.meta.image),
			cards
		);
		await this.spriteSheet.parse();
	}
	displayHud()
	{
		this.loadAssets();
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
			let weaponSprite = new PIXI.Sprite(this.spriteSheet.textures['CARD_' + weapon.name]);
			weaponSprite.eventMode = 'static';
			weaponSprite.on('pointerup', (event) => { window.client.selectWeapon(weapon.name); } );
			weaponSprite.width = weapon.width;
			weaponSprite.height = weapon.length;
			weaponSprite.position.set(weapon.x,weapon.y);
			this.weaponContainer.addChild(weaponSprite);
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
			let cardSprite = new PIXI.Sprite(this.spriteSheet.textures['CARD_' + card.name]);
			let pixiCard = new PIXI.Graphics();
			pixiCard.eventMode = 'static';
			pixiCard.on('pointerup', (event) => { window.client.selectCard(card.name, card.type); } );
			pixiCard.drawRect(0,0,card.width,card.length);
			pixiCard.position.set(card.x,card.y);
			pixiCard.addChild(cardSprite);
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
			text.x = button.width/2 - text.width/2;
			text.y = button.length/2 - text.height/2;
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
		this.roomSprites;
		this.displayMap();
	}
	async loadAssets()
	{
		let mapRoom = {
			"frames": {
				"HALL":
				{
					"frame": {'x':315,'y':46,'w':161,'h':169},
					"spriteSourceSize": {'x':0,'y':0,'w':161,'h':169},
					"sourceSize": {'w':161,'h':169},
				},
				'STUDY':
				{
					"frame": {'x':43,'y':35,'w':168,'h':107},
					"spriteSourceSize": {'x':0,'y':0,'w':168,'h':107},
					"sourceSize": {'w':168,'h':107}
				},
                'LIBRARY':
				{
					"frame": {'x':72,'y':202,'w':139,'h':124},
					"spriteSourceSize": {'x':0,'y':0,'w':139,'h':124},
					"sourceSize": {'w':139,'h':124}
				},
                'CONSERVATORY':
				{
					"frame": {'x':44,'y':594,'w':167,'h':101},
					"spriteSourceSize": {'x':0,'y':0,'w':167,'h':101},
					"sourceSize": {'w':167,'h':101}
				},
                'BILLIARDROOM':
				{
					"frame": {'x':42,'y':371,'w':169,'h':122},
					"spriteSourceSize": {'x':0,'y':0,'w':169,'h':122},
					"sourceSize": {'w':169,'h':122}
				},
                'BALLROOM':
				{
					"frame": {'x':286,'y':512,'w':218,'h':150},
					"spriteSourceSize": {'x':0,'y':0,'w':218,'h':150},
					"sourceSize": {'w':218,'h':150}
				},
                'LOUNGE':
				{
					"frame": {'x':582,'y':36,'w':166,'h':153},
					"spriteSourceSize": {'x':0,'y':0,'w':166,'h':153},
					"sourceSize": {'w':166,'h':153}
				},
                'DININGROOM':
				{
					"frame": {'x':521,'y':286,'w':228,'h':153},
					"spriteSourceSize": {'x':0,'y':0,'w':228,'h':153},
					"sourceSize": {'w':228,'h':153}
				},
                'KITCHEN':
				{
					"frame": {'x':580,'y':539,'w':140,'h':159},
					"spriteSourceSize": {'x':0,'y':0,'w':140,'h':159},
					"sourceSize": {'w':140,'h':159}
				}
			},
			"meta": {
				"image": "/assets/gamerooms.jpg",
				"format": "RGBA8888",
				"size": {"w":792,"h":752},
				"scale": 161/this.re
			}
		};
		// Set sprite coordinates based on abstract GameMap model
		for( var room in this.rooms )
		{
			let roomArea = this.rooms[room];
			let spriteCenterX = ( ( mapRoom.frames[room].frame.w/2 ) / mapRoom.meta.scale );
			let spriteCenterY = ( ( mapRoom.frames[room].frame.h/2 ) / mapRoom.meta.scale );
			let roomStartX = roomArea.width/2 - spriteCenterX;
			let roomStartY = roomArea.length/2 - spriteCenterY;
			roomArea.x = roomArea.x + roomStartX;
			roomArea.y = roomArea.y + roomStartY;
		}
		this.roomSprites = new PIXI.Spritesheet(
			PIXI.BaseTexture.from(mapRoom.meta.image),
			mapRoom
		);
		await this.roomSprites.parse();
	}
	displayMap()
	{
		this.displayHallways();
		this.loadAssets();
		this.displayRooms();
		//this.displayPassageways();
	}
	displayRooms() {
		if ( this.roomContainer != null )
		{
			// free the memory!
			this.roomContainer.destroy();
		}
		this.roomContainer = new PIXI.Graphics();
		for(var room in this.rooms) {
			let roomSprite = new PIXI.Sprite(this.roomSprites.textures[room]);
			let roomObj = this.rooms[room];
			let roomX = roomObj.x;
			let roomY = roomObj.y;

			roomSprite.eventMode = 'static';
			roomSprite.on('pointerup', (event) => { window.client.selectRoom(roomObj.name); } );
			roomSprite.position.x = roomX;
			roomSprite.position.y = roomY;
			this.rooms[room].element = roomSprite;

			this.roomContainer.addChild(roomSprite);
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
