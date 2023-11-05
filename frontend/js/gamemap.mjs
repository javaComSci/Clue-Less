/*
 * Abstract representation of the Clue-Less game map. Graphics libraries
 * can inherit this and implement display functions.
 */
import { CharacterConstants } from '/common/representations/character.mjs';
import { Character,Room,Hallway,Passageway,Weapon,Start } from '/js/spaces.js';
export class GameMap
{
    constructor(height, width)
    {
		// screen height
		this.sh = height;
		// screen width
		this.sw = width;
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
		// character edge
		this.ce = this.hs/2;
		// passageway edge
		this.pe = this.hs/2;
		/*
		 * TODO: Find better way to represent coordinates than below
		 */
		this.room_coordinates = {
			'STUDY': { 'x': this.mb, 'y': this.mb },
			'LIBRARY': { 'x': this.mb, 'y': this.mb + this.re + this.hl },
			'CONSERVATORY': { 'x': this.mb, 'y': this.mb + 2 * ( this.re + this.hl ) },
			'HALL': { 'x': this.mb + this.re + this.hl, 'y': this.mb },
			'BILLIARD ROOM': { 'x': this.mb + this.re + this.hl, 'y': this.mb + this.re + this.hl },
			'BALLROOM': { 'x': this.mb + this.re + this.hl, 'y': this.mb + 2 * ( this.re + this.hl ) },
			'LOUNGE': { 'x': this.mb + 2 * ( this.re + this.hl ), 'y': this.mb },
			'DINING ROOM': { 'x': this.mb + 2 * ( this.re + this.hl ), 'y': this.mb + this.re + this.hl },
			'KITCHEN': { 'x': this.mb + 2 * ( this.re + this.hl ), 'y': this.mb + 2 * ( this.re + this.hl ) }
		};
		this.hallway_across_coordinates = {
			'STUDY_HALL': { 'x': this.mb + this.re, 'y': this.mb + this.re/3 },
			'LIBRARY_BILLIARDROOM': { 'x': this.mb + this.re, 'y': this.mb + this.re/3 + this.hl + this.re },
			'BALLROOM_CONSERVATORY': { 'x': this.mb + this.re, 'y': this.mb + this.re/3 + 2 * ( this.hl + this.re ) },
			'HALL_LOUNGE': { 'x': this.mb + this.re + this.hl + this.re, 'y': this.mb + this.re/3 },
			'DININGROOM_BILLIARDROOM': { 'x': this.mb + this.re + this.hl + this.re, 'y': this.mb + this.re/3 + this.hl + this.re },
			'KITCHEN_BALLROOM': { 'x': this.mb + this.re + this.hl + this.re, 'y': this.mb + this.re/3 + 2 * ( this.hl + this.re ) },
		};
		this.hallway_down_coordinates = {
			'LIBRARY_STUDY': { 'x': this.mb + this.re/3, 'y': this.mb + this.re },
			'CONSERVATORY_LIBRARY': { 'x': this.mb + this.re/3, 'y': this.mb + this.hl + ( 2 * this.re ) },
			'HALL_BILLARDROOM': { 'x': this.mb + this.re/3 + this.hl + this.re, 'y': this.mb + this.re },
			'BALLROOM_BILLARDROOM': { 'x': this.mb + this.re/3 + this.hl + this.re, 'y': this.mb + this.re + this.hl + this.re },
			'LOUNGE_DININGROOM': { 'x': this.mb + this.re/3 + 2 * ( this.hl + this.re ), 'y': this.mb + this.re },
			'DININGROOM_KITCHEN': { 'x': this.mb + this.re/3 + 2 * ( this.hl + this.re ), 'y': this.mb + this.re + this.hl + this.re }
		};
		this.starts_coordinates = {
			'HALL_LOUNGE_HOME': { 'x': this.hallway_across_coordinates['HALL_LOUNGE'].x + this.hl/2,
									'y': this.hallway_across_coordinates['HALL_LOUNGE'].y - this.ce },
			'LOUNGE_DININGROOM_HOME': {'x': this.hallway_down_coordinates['LOUNGE_DININGROOM'].x + this.hs,
										'y': this.hallway_down_coordinates['LOUNGE_DININGROOM'].y + this.hl/2},
			'KITCHEN_BALLROOM_HOME': {'x': this.hallway_across_coordinates['KITCHEN_BALLROOM'].x + this.hl/2,
										'y': this.hallway_across_coordinates['KITCHEN_BALLROOM'].y + this.hs },
			'BALLROOM_CONSERVATORY_HOME': {'x': this.hallway_across_coordinates['BALLROOM_CONSERVATORY'].x + this.hl/2,
											'y': this.hallway_across_coordinates['BALLROOM_CONSERVATORY'].y + this.hs },
			'CONSERVATORY_LIBRARY_HOME': {'x': this.hallway_down_coordinates['CONSERVATORY_LIBRARY'].x - this.ce,
											'y': this.hallway_down_coordinates['CONSERVATORY_LIBRARY'].y + this.hl/2},
			'LIBRARY_STUDY_HOME': {'x': this.hallway_down_coordinates['LIBRARY_STUDY'].x - this.ce,
									'y': this.hallway_down_coordinates['LIBRARY_STUDY'].y + this.hl/2}
		};
		this.passageway_coordinates = {
			'STUDY': {'x': this.room_coordinates['STUDY'].x + this.re - this.pe,
						'y': this.room_coordinates['STUDY'].y + this.re - this.pe,
						'dest': 'KITCHEN'},
			'KITCHEN': {'x': this.room_coordinates['KITCHEN'].x + this.re - this.pe,
						'y': this.room_coordinates['KITCHEN'].y + this.re - this.pe,
						'dest': 'STUDY'},
			'LOUNGE': {'x': this.room_coordinates['LOUNGE'].x + this.re - this.pe,
						'y': this.room_coordinates['LOUNGE'].y + this.re - this.pe,
						'dest': 'CONSERVATORY'},
			'CONSERVATORY': {'x': this.room_coordinates['CONSERVATORY'].x + this.re - this.pe,
						'y': this.room_coordinates['CONSERVATORY'].y + this.re - this.pe,
						'dest': 'LOUNGE'}
		}
		this.rooms = {};
		this.hallways = {};
		this.starts = {};
		this.locations = {};
		this.passageways = {};
		this.characters = {};
    }

	// creates rooms
	createRooms()
	{
		// for each key, create room with coordinate
		for(var room in this.room_coordinates) {
			let x = this.room_coordinates[room]['x'];
			let y = this.room_coordinates[room]['y'];
			let roomNew = new Room(room, x, y, this.re, this.re);
			this.rooms[room] = roomNew;
			this.locations[room] = roomNew;
		}
	}
	
	// creates hallways and displays them in the app
	createHallways()
	{
		// for each key, create hallway with long side horizontal
		for(var hallway in this.hallway_across_coordinates) {
			let x = this.hallway_across_coordinates[hallway]['x'];
			let y = this.hallway_across_coordinates[hallway]['y'];
			let hallwayNew = new Hallway(hallway, x, y, this.hl, this.hs);
			this.hallways[hallway] = hallwayNew;
			this.locations[hallway] = hallwayNew;
		}

		// for each key, create hallway with long side vertical
		for(var hallway in this.hallway_down_coordinates) {
			let x = this.hallway_down_coordinates[hallway]['x'];
			let y = this.hallway_down_coordinates[hallway]['y'];
			let hallwayNew = new Hallway(hallway, x, y, this.hs, this.hl);
			this.hallways[hallway] = hallwayNew;
			this.locations[hallway] = hallwayNew;
		}
	}
	createStarts()
	{
		// for each key, create start position with coordinate
		for(var start in this.starts_coordinates) {
			let x = this.starts_coordinates[start]['x'];
			let y = this.starts_coordinates[start]['y'];
			let startNew = new Start(start, x, y, 0, 0);
			this.starts[start] = startNew;
			this.locations[start] = startNew;
		}
	}
	// creates passageways
	createPassageways()
	{
		for(var passageway in this.passageway_coordinates) {
			let x = this.passageway_coordinates[passageway]['x'];
			let y = this.passageway_coordinates[passageway]['y'];
			let dest = this.passageway_coordinates[passageway]['dest'];
			let passagewayNew = new Passageway(passageway, dest, x, y, this.pe, this.pe);
			this.passageways[passageway] = passagewayNew;
			this.locations[passageway + '_PASS'] = passagewayNew;
		}
	}
	// creates characters
	createCharacters()
	{
		for(var character in CharacterConstants) {
			this.characters[character] = new Character(character, 0, 0, this.ce, this.ce );
		}
	}
	// creates the map
	createMap()
	{
		this.createRooms();
		this.createHallways();
		this.createCharacters();
		this.createStarts();
		this.createPassageways();
	}
	/*
	 * Define in subclass
	 */
	displayRooms()
	{
	}
	displayHallways()
	{
	}
	displayPassageways()
	{
	}
	displayCharacters()
	{
	}
}
