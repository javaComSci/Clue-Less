import { GameMap } from '/js/gamemap.mjs';

export class PixiMap extends GameMap
{
	constructor(app)
	{
		super(app.renderer.view.height, app.renderer.view.width);
		this.app = app;
		super.createMap();
	}

	displayRooms() {
		for(var room in this.rooms) {
			const rectangle = new PIXI.Graphics();
			rectangle.beginFill(0x66CCFF);
			rectangle.drawRect(this.rooms[room].x,this.rooms[room].y,this.rooms[room].length,this.rooms[room].width);
			rectangle.endFill();
			this.app.stage.addChild(rectangle);
			//this.room_rectangles.push(rectangle);
		}
	}
	displayHallways() {
		for(var hallway in this.hallways) {
			const rectangle = new PIXI.Graphics();
			rectangle.beginFill(0xD359DF);
			rectangle.drawRect(this.hallways[hallway].x,this.hallways[hallway].y,this.hallways[hallway].length,this.hallways[hallway].width);
			rectangle.endFill();
			this.app.stage.addChild(rectangle);
			//this.hallway_rectangles.push(rectangle);
		}
	}
}
