export class GameCard
{
    constructor(name, type)
    {
        this.name = name;
        this.type = type;
    }

    static chooseMysteryCardIndexFromSelection(cards)
	{
		return Math.floor(cards.length * Math.random());
	}
}

