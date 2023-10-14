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
		this.hallway_across_coordinates.forEach((hallway) => {
			const rectangle = new PIXI.Graphics();
			rectangle.beginFill(0x66CCFF);
			rectangle.drawRect(hallway[0],hallway[1],this.hl,this.hs);
			rectangle.endFill();
			app.stage.addChild(rectangle);
			this.hallway_rectangles.push(rectangle);
		});
		this.hallway_down_coordinates.forEach((hallway) => {
			const rectangle = new PIXI.Graphics();
			rectangle.beginFill(0x66CCFF);
			rectangle.drawRect(hallway[0],hallway[1],this.hs,this.hl);
			rectangle.endFill();
			app.stage.addChild(rectangle);
			this.hallway_rectangles.push(rectangle);
		});
	}
}
