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

export class Passageway extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
	}
}

export class Room extends Space
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

export class Hallway extends Space
{
	constructor(name, x, y, length, width)
	{
		super(x, y, length, width);
		this.name = name;
		this.playerLocationX = x + length/3;
		this.playerLocationY = y + width/3;
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
