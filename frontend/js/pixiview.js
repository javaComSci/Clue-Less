/*
 * Graphical implementation of a GameMap using PIXIJS
 */
import { GameMap } from '/js/gamemap.mjs';

export class PixiMap extends GameMap
{
	constructor(app)
	{
		super(app.renderer.view.height, app.renderer.view.width);
		this.app = app;
		super.createMap();
		this.displayMap();
	}
	displayMap()
	{
		this.displayRooms();
		this.displayHallways();
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
			let charRep = this.characters[character.name];
			let charX = this.locations[character.currentLocation].playerLocationX;
			let charY = this.locations[character.currentLocation].playerLocationY;

			this.characterContainer.beginFill(0xFBF8FB);
			this.characterContainer.drawRect(charX,charY,this.ce,this.ce);
			this.characterContainer.endFill();
		});
		this.app.stage.addChild(this.characterContainer);
	}
}
