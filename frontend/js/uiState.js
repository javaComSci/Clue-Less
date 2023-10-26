/*
 * Updates the UI
 */
import { PixiMap } from '/js/pixiview.js';

export function initializeGame(app)
{
	createMap(app);
}

async function createMap(app) {
	const piximap = new PixiMap(app);
	piximap.displayRooms();
	piximap.displayHallways();
	/*
	 * Does some basic 'movement'
	 */
	piximap.displayCharacters([{"name":"SCARLET","currentLocation":"HALL_LOUNGE","type":"CHARACTER","priorLocation":"HALL_LOUNGE_HOME"}]);
	await new Promise(r => setTimeout(r, 2000))
	piximap.displayCharacters([{"name":"SCARLET","currentLocation":"HALL","type":"CHARACTER","priorLocation":"HALL_LOUNGE_HOME"}]);
}
