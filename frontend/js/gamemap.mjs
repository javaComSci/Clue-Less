import { CharacterConstants } from '/common/representations/character.mjs';
/*
 * Abstract representation of the Clue-Less game map. Graphics libraries
 * can inherit this and implement display functions.
 */
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
			'CONSERVATORY_BALLROOM': { 'x': this.mb + this.re, 'y': this.mb + this.re/3 + 2 * ( this.hl + this.re ) },
			'HALL_LOUNGE': { 'x': this.mb + this.re + this.hl + this.re, 'y': this.mb + this.re/3 },
			'BILLIARDROOM_DININGROOM': { 'x': this.mb + this.re + this.hl + this.re, 'y': this.mb + this.re/3 + this.hl + this.re },
			'BALLROOM_KITCHEN': { 'x': this.mb + this.re + this.hl + this.re, 'y': this.mb + this.re/3 + 2 * ( this.hl + this.re ) },
		};
		this.hallway_down_coordinates = {
			'STUDY_LIBRARY': { 'x': this.mb + this.re/3, 'y': this.mb + this.re },
			'LIBRARY_CONSERVATORY': { 'x': this.mb + this.re/3, 'y': this.mb + this.hl + ( 2 * this.re ) },
			'HALL_BILLARDROOM': { 'x': this.mb + this.re/3 + this.hl + this.re, 'y': this.mb + this.re },
			'BILLIARDROOM_BALLROOM': { 'x': this.mb + this.re/3 + this.hl + this.re, 'y': this.mb + this.re + this.hl + this.re },
			'LOUNGE_DININGROOM': { 'x': this.mb + this.re/3 + 2 * ( this.hl + this.re ), 'y': this.mb + this.re },
			'DININGROOM_KITCHEN': { 'x': this.mb + this.re/3 + 2 * ( this.hl + this.re ), 'y': this.mb + this.re + this.hl + this.re }
		};
		this.rooms = {};
		this.hallways = {};
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
	// creates passageways
	createPassageways()
	{
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

class Space
{
	constructor(x, y, length, width)
	{
		this.x = x;
		this.y = y;
		this.length = length;
		this.width = width;
		this.element;
	}
}

class Passageway extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
	}
}

class Room extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.playerLocationX = x + length/3;
		this.playerLocationY = y + width/3;
		/* be careful here, these are somewhat arbitrary. 
		 * If player area size is too large, they may overlap */
		this.playerSuggestLocationX = x + (2 * length/3);
		this.playerSuggestLocationY = y + width/3;
	}
}

class Hallway extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.playerLocationX = x + length/3;
		this.playerLocationY = y + width/3;
	}
}

class Character extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name;
	}
}
