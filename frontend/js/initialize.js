import { Map, Room, Hallway } from '/js/gamemap.mjs';

export function initializeGame(app)
{
	createMap(app);
}

function createGameObjects(app)
{
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
	const map = new Map(app);
	map.createRooms(app);
	map.createHallways(app);
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

