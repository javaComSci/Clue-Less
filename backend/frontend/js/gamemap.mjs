export class Map
{
    constructor(rooms, hallways)
    {
        this.rooms = rooms;
		this.hallways = hallways;
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
