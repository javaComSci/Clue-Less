import { GameCard } from "./gameCard.mjs";

export const WeaponConstants = {
    CANDLESTICK: 'CANDLESTICK',
    DRAGGER: 'DRAGGER',
    PIPE: 'PIPE',
    REVOLVER: 'REVOLVER',
    ROPE: 'ROPE',
    WRENCH: 'WRENCH'
};

export class WeaponCard extends GameCard
{
    constructor(name, currentLocation)
    {
        super(currentLocation, 'WEAPON');
        this.name = name;
    }
}