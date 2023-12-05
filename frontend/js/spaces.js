class Space
{
	constructor(x, y, length, width)
	{
		this.x = x;
		this.y = y;
		this.length = length;
		this.width = width;
		this.occupants = 0;
		this.element;
	}
	resetOccupants()
	{
		// implement in child class if necessary
	}
	getPlayerLocation()
	{
		// implement in child class if necessary
	}
}

export class Passageway extends Space
{
	constructor(name, destination, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.destination = destination;
	}
}

export class Room extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.playerLocations = [
			{ 'x': x + width/8, 'y': y + length/4 },
			{ 'x': x + 3 * width/8, 'y': y + length/4 },
			{ 'x': x + 5 * width/8, 'y': y + length/4 },
			{ 'x': x + width/8, 'y': y + length/2 },
			{ 'x': x + 3 * width/8, 'y': y + length/2 },
			{ 'x': x + 5 * width/8, 'y': y + length/2 }
		];
	}
	getPlayerLocation()
	{
		this.occupants += 1;
		return this.playerLocations[this.occupants-1];
	}
	resetOccupants()
	{
		this.occupants = 0;
	}
}

export class Hallway extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.playerLocationX = x + length/6;
		this.playerLocationY = y + width/6;
	}
	getPlayerLocation()
	{
		this.occupants += 1;
		return {'x':this.playerLocationX,'y':this.playerLocationY};
	}
}

export class Character extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name;
	}
}

export class Weapon extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
	}
}

export class Start extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.playerLocationX = x;
		this.playerLocationY = y;
	}
	getPlayerLocation()
	{
		return {'x':this.playerLocationX,'y':this.playerLocationY};
	}
}

export class Card extends Space
{
	constructor(name, content, type, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.type = type;
		this.content = content;
	}
}

export class Button extends Space
{
	constructor(name, content, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.content = content;
	}
}
export class Alert extends Space
{
	constructor(name, content, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.content = content;
	}
}
