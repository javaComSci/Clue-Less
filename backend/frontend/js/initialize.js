import { Map, Room, Hallway } from './gamemap.mjs';

export function initializeGame(app)
{
	createMap(app);
}

function createMap(app) {
	// for i in i
	//createRoom('room1');
	// add room to 
	// create 9 squares
	// each square is centered on a multiple of 1/3 of the length and width
	// create hallways connecting squares
	// create passageways
	//const map = new Map(rooms, hallways);
	//return map;
// screen width
	const Sw = app.renderer.view.width;
	// screen height
	const Sh = app.renderer.view.height;
	// map buffer
	const Mb = 25;
	// map width
	const Mw = Sw - 2 * Mb;
	// map height
	const Mh = Sh - 2 * Mb;
	// room edge
	const Re = Mh/5;
	// hallway ( long side )
	const Hl = Re;
	// hallway ( short side )
	const Hs = Re/3;

	const room_coordinates = [
		[ Mb, Mb ],
		[ Mb, Mb + Re + Hl ],
		[ Mb, Mb + 2 * ( Re + Hl ) ],
		[ Mb + Re + Hl, Mb ],
		[ Mb + Re + Hl, Mb + Re + Hl ],
		[ Mb + Re + Hl, Mb + 2 * ( Re + Hl ) ],
		[ Mb + 2 * ( Re + Hl ), Mb ],
		[ Mb + 2 * ( Re + Hl ), Mb + Re + Hl ],
		[ Mb + 2 * ( Re + Hl ), Mb + 2 * ( Re + Hl ) ]
	];

	const hallway_across_coordinates = [
		[ Mb + Re, Mb + Re/3 ],
		[ Mb + Re, Mb + Re/3 + Hl + Re ],
		[ Mb + Re, Mb + Re/3 + 2 * ( Hl + Re ) ],
		[ Mb + Re + Hl + Re, Mb + Re/3 ],
		[ Mb + Re + Hl + Re, Mb + Re/3 + Hl + Re ],
		[ Mb + Re + Hl + Re, Mb + Re/3 + 2 * ( Hl + Re ) ],
	];

	const hallway_down_coordinates = [
		[ Mb + Re/3, Mb + Re ],
		[ Mb + Re/3, Mb + Hl + ( 2 * Re ) ],
		[ Mb + Re/3 + Hl + Re, Mb + Re ],
		[ Mb + Re/3 + Hl + Re, Mb + Re + Hl + Re ],
		[ Mb + Re/3 + 2 * ( Hl + Re ), Mb + Re ],
		[ Mb + Re/3 + 2 * ( Hl + Re ), Mb + Re + Hl + Re ]
	];

	let room_rectangles = [];
	room_coordinates.forEach((room) => {
		const rectangle = new PIXI.Graphics();
		rectangle.beginFill(0x66CCFF);
		rectangle.drawRect(room[0],room[1],Re,Re);
		rectangle.endFill();
		app.stage.addChild(rectangle);
		room_rectangles.push(rectangle);
	});

	let hallway_rectangles = [];
	hallway_across_coordinates.forEach((hallway) => {
		const rectangle = new PIXI.Graphics();
		rectangle.beginFill(0x66CCFF);
		rectangle.drawRect(hallway[0],hallway[1],Hl,Hs);
		rectangle.endFill();
		app.stage.addChild(rectangle);
		hallway_rectangles.push(rectangle);
	});

	hallway_down_coordinates.forEach((hallway) => {
		const rectangle = new PIXI.Graphics();
		rectangle.beginFill(0x66CCFF);
		rectangle.drawRect(hallway[0],hallway[1],Hs,Hl);
		rectangle.endFill();
		app.stage.addChild(rectangle);
		hallway_rectangles.push(rectangle);
	});
}

function createRoom(name) 
{
	/*const rectangle = new PIXI.Graphics();
	rectangle.beginFill(0x66CCFF);
	rectangle.drawRect(100,200,2000,2000);
	rectangle.endFill();
	app.stage.addChild(rectangle);*/

}

function createHallway()
{

}

