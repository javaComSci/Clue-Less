export class Map
{
    constructor(app)
    {
		// screen width
		this.sw = app.renderer.view.width;
		// screen height
		this.sh = app.renderer.view.height;
		// map buffer
		this.mb = 25;
		// map width
		this.mw = this.sw - 2 * this.mb;
		// map height
		this.mh = this.sh - 2 * this.mb;
		// room edge
		this.re = this.mh/5;
		// hallway ( long side )
		this.hl = this.re;
		// hallway ( short side )
		this.hs = this.re/3;
		this.room_coordinates = [
			[ this.mb, this.mb ],
			[ this.mb, this.mb + this.re + this.hl ],
			[ this.mb, this.mb + 2 * ( this.re + this.hl ) ],
			[ this.mb + this.re + this.hl, this.mb ],
			[ this.mb + this.re + this.hl, this.mb + this.re + this.hl ],
			[ this.mb + this.re + this.hl, this.mb + 2 * ( this.re + this.hl ) ],
			[ this.mb + 2 * ( this.re + this.hl ), this.mb ],
			[ this.mb + 2 * ( this.re + this.hl ), this.mb + this.re + this.hl ],
			[ this.mb + 2 * ( this.re + this.hl ), this.mb + 2 * ( this.re + this.hl ) ]
		];
		this.hallway_across_coordinates = [
			[ this.mb + this.re, this.mb + this.re/3 ],
			[ this.mb + this.re, this.mb + this.re/3 + this.hl + this.re ],
			[ this.mb + this.re, this.mb + this.re/3 + 2 * ( this.hl + this.re ) ],
			[ this.mb + this.re + this.hl + this.re, this.mb + this.re/3 ],
			[ this.mb + this.re + this.hl + this.re, this.mb + this.re/3 + this.hl + this.re ],
			[ this.mb + this.re + this.hl + this.re, this.mb + this.re/3 + 2 * ( this.hl + this.re ) ],
		];
		this.hallway_down_coordinates = [
			[ this.mb + this.re/3, this.mb + this.re ],
			[ this.mb + this.re/3, this.mb + this.hl + ( 2 * this.re ) ],
			[ this.mb + this.re/3 + this.hl + this.re, this.mb + this.re ],
			[ this.mb + this.re/3 + this.hl + this.re, this.mb + this.re + this.hl + this.re ],
			[ this.mb + this.re/3 + 2 * ( this.hl + this.re ), this.mb + this.re ],
			[ this.mb + this.re/3 + 2 * ( this.hl + this.re ), this.mb + this.re + this.hl + this.re ]
		];
		this.room_rectangles = [];
		this.hallway_rectangles = [];
    }

	// creates rooms and displays them in the app
	createRooms(app)
	{
		this.room_coordinates.forEach((room) => {
			const rectangle = new PIXI.Graphics();
			rectangle.beginFill(0x66CCFF);
			rectangle.drawRect(room[0],room[1],this.re,this.re);
			rectangle.endFill();
			app.stage.addChild(rectangle);
			this.room_rectangles.push(rectangle);
		});
	}
	
	// creates hallways and displays them in the app
	createHallways(app)
	{
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
	// creates passageways and displays them in the app
	createPassageways(passagewayList)
	{
	}
}

export class Room
{
	constructor(name, space)
	{
		this.name = name;
		this.space = space;
	}
}

export class Hallway
{
	constructor(name, space)
	{
		this.name = name;
		this.space = space;
	}
}
