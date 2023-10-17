import { PixiMap } from '/js/pixiview.js';

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
	//
	const piximap = new PixiMap(app);
	piximap.displayRooms();
	piximap.displayHallways();
	//return map;
}
