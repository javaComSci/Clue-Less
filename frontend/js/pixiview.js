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
		this.spriteActionButton;
		this.spriteSheet;
		this.areaColors = {
			'characterName': 0xE1E497,
			'actions': 0xF9FAD7,
			'weapons': 0xE1E497,
			'alerts': 0xFFFF00,
			'cards': 0xF9FAD7,
		};
		this.fontFamily = "\"Lucida Console\", Monaco, monospace";
		this.fontOptions = {
			'characterName': {
				'size': 42,
				'color': 0x6F4E37,
				'family': this.fontFamily
			},
			'cards': {
				'size': 42,
				'color': 0x6F4E37,
				'family': this.fontFamily
			},
			'actions': {
				'size': 42,
				'color': 0x6F4E37,
				'family': this.fontFamily
			},
			'weapons': {
				'size': 42,
				'color': 0x6F4E37,
				'family': this.fontFamily
			},
			'alerts': {
				'size': 20,
				'color': 0x303004,
				'family': this.fontFamily
			},
			'buttons': {
				'size': 25,
				'color': 0x6F4E37,
				'family': this.fontFamily
			},
		};
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
				"CARD_DININGROOM":
				{
					"frame": {'x':120,'y':473,'w':84,'h':146}
				},
				"CARD_LOUNGE":
				{
					"frame": {'x':220,'y':473,'w':84,'h':146}
				},
				"CARD_BILLIARDROOM":
				{
					"frame": {'x':320,'y':473,'w':84,'h':146}
				},
				"CARD_UNKNOWN":
				{
					"frame": {'x':420,'y':473,'w':84,'h':146}
				},
			},
			"meta": {
				"image": "/assets/gamepieces.jpg",
				"format": "RGBA8888",
				"size": {"w":640,"h":620},
				"scale": 1
			}
		};
		let button = {
			"frames": {
				"BUTTON":
				{
					"frame": {'x':54,'y':121,'w':152,'h':119}
				},
			},
			"meta": {
				"image": "/assets/gamebutton.png",
				"format": "RGBA8888",
				"size": {"w":360,"h":360},
				"scale": 1
			}
		};
		this.spriteActionButton = new PIXI.Spritesheet(
			PIXI.BaseTexture.from(button.meta.image),
			button
		);
		this.spriteSheet = new PIXI.Spritesheet(
			PIXI.BaseTexture.from(cards.meta.image),
			cards
		);
		await this.spriteActionButton.parse();
		await this.spriteSheet.parse();

	}
	displayHud()
	{
		this.loadAssets().then(()=>
		{
			this.displayButtons();
			this.displayCards();
			this.displayWeapons();
			this.displayCharacterName();
			this.displayAlerts();
		});
	}
	displayCharacterName()
	{
		if ( this.charNameContainer != null )
		{
			// free the memory!
			this.charNameContainer.destroy();
		}
		this.charNameContainer = new PIXI.Graphics();
		this.charNameContainer.beginFill(this.areaColors.characterName);
		this.charNameContainer.drawRect(this.characterNameAreaStartX,this.characterNameAreaStartY,this.characterNameAreaWidth,this.characterNameAreaHeight);
		this.charNameContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Your Character:\n', {
				fontSize: this.fontOptions.characterName.size,
				fill: this.fontOptions.characterName.color,
				fontFamily: this.fontOptions.characterName.family
			}
		);
		hudAreaText.x = this.characterNameAreaStartX + this.characterNameAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.characterNameAreaStartY;
		this.charNameContainer.addChild(hudAreaText);

		if(this.avatar != '')
		{
			let characterCard = this.avatar;
			let cardSprite = new PIXI.Sprite(this.spriteSheet.textures['CARD_' + characterCard.name]);
			cardSprite.height = characterCard.length;
			cardSprite.width = characterCard.width;
			cardSprite.position.set(characterCard.x,characterCard.y);
			this.charNameContainer.addChild(cardSprite);
		}

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
		this.weaponContainer.beginFill(this.areaColors.weapons);
		this.weaponContainer.drawRect(this.weaponAreaStartX,this.weaponAreaStartY,this.weaponAreaWidth,this.weaponAreaHeight);
		this.weaponContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Weapons', {
				fontSize: this.fontOptions.weapons.size,
				fill: this.fontOptions.weapons.color,
				fontFamily: this.fontOptions.weapons.family
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
		this.cardContainer.beginFill(this.areaColors.cards);
		this.cardContainer.drawRect(this.cardAreaStartX,this.cardAreaStartY,this.cardAreaWidth,this.cardAreaHeight);
		this.cardContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Cards', {
				fontSize: this.fontOptions.cards.size,
				fill: this.fontOptions.cards.color,
				fontFamily: this.fontOptions.cards.family
			}
		);
		hudAreaText.x = this.cardAreaStartX + this.cardAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.cardAreaStartY;
		this.cardContainer.addChild(hudAreaText);
		this.cards.forEach((card) => {
			let cardSprite = new PIXI.Sprite(this.spriteSheet.textures['CARD_' + card.name]);
			cardSprite.eventMode = 'static';
			cardSprite.on('pointerup', (event) => { window.client.selectCard(card.name, card.type); } );
			cardSprite.height = card.length;
			cardSprite.width = card.width;
			cardSprite.position.set(card.x,card.y);
			this.cardContainer.addChild(cardSprite);
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
		this.buttonContainer.beginFill(this.areaColors.actions);
		this.buttonContainer.drawRect(this.buttonAreaStartX,this.buttonAreaStartY,this.buttonAreaWidth,this.buttonAreaHeight);
		this.buttonContainer.endFill();
		let hudAreaText = new PIXI.Text(
				'Actions', {
				fontSize: this.fontOptions.actions.size,
				fill: this.fontOptions.actions.color,
				fontFamily: this.fontOptions.actions.family
			}
		);
		hudAreaText.x = this.buttonAreaStartX + this.buttonAreaWidth/2 - hudAreaText.width/2;
		hudAreaText.y = this.buttonAreaStartY;
		this.buttonContainer.addChild(hudAreaText);
		this.buttons.forEach((button) => {
			let buttonSprite = new PIXI.Sprite(this.spriteActionButton.textures['BUTTON']);
			this.app.stage.addChild(buttonSprite);
			buttonSprite.eventMode = 'static';
			buttonSprite.on('pointerup', (event) => { window.client.selectButton(button.name); } );
			buttonSprite.height = button.length;
			buttonSprite.width = button.width;
			buttonSprite.position.set(button.x,button.y);
			let text = new PIXI.Text(
				button.content, {
					fontSize: this.fontOptions.buttons.size,
					fill: this.fontOptions.buttons.color,
					fontFamily: this.fontOptions.buttons.family
				}
			);
			text.x = (buttonSprite.width/2 / buttonSprite.scale.x) - text.width/2;
			text.y = (buttonSprite.height/2 / buttonSprite.scale.y) - text.height/2;
			buttonSprite.addChild(text);
			this.buttonContainer.addChild(buttonSprite);
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
		this.alertContainer.beginFill(this.areaColors.alerts);
		this.alertContainer.drawRect(this.alertAreaStartX,this.alertAreaStartY,this.alertAreaWidth,this.alertAreaHeight);
		this.alertContainer.endFill();
		this.alerts.forEach((alertInfo) => {
			let pixiAlert = new PIXI.Graphics();
			pixiAlert.eventMode = 'static';
			pixiAlert.on('pointerup', (event) => { window.client.testme(alertInfo.content); } );
			pixiAlert.beginFill(this.areaColors.alerts);
			pixiAlert.drawRect(0,0,alertInfo.width,alertInfo.length);
			pixiAlert.endFill();
			let text = new PIXI.Text(
				alertInfo.content, {
					fontSize: this.fontOptions.alerts.size,
					fill: this.fontOptions.alerts.color,
					fontFamily: this.fontOptions.alerts.family
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
		this.hallwaySprite;
		this.characterSprites = {};
		this.areaColors = {
			'hallways': 0xE1E497,
		};
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
					"frame": {'x':43,'y':35,'w':168,'h':95},
					"spriteSourceSize": {'x':0,'y':0,'w':168,'h':95},
					"sourceSize": {'w':168,'h':95}
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
		this.characterSprites['GREEN'] = PIXI.Sprite.from("/assets/green.png");

		this.hallwayTexture = await PIXI.Assets.load("/assets/hallway.png");

		await PIXI.Assets.load("/assets/background.png");
		let backgroundSprite = new PIXI.Sprite(PIXI.Texture.from("/assets/background.png"));
		backgroundSprite.height = this.sh;
		backgroundSprite.width = this.sw;
		backgroundSprite.position.set(0,0);
		this.app.stage.addChild(backgroundSprite);

		this.roomSprites = new PIXI.Spritesheet(
			PIXI.BaseTexture.from(mapRoom.meta.image),
			mapRoom
		);
		await this.roomSprites.parse();
	}
	displayMap()
	{
		this.loadAssets().then(() =>
		{
			this.displayHallways();
			this.displayRooms();
		});
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
			roomSprite.width = this.rooms[room].width;
			roomSprite.height = this.rooms[room].length;
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

			pixiHallway.beginFill(this.areaColors.hallways);
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
