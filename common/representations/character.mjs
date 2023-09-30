import { GameCard } from "./gameCard.mjs";

export const CharacterConstants = {
    SCARLET: 'SCARLET',
    PLUM: 'PLUM',
    WHITE: 'WHITE',
    GREEN: 'GREEN',
    MUSTARD: 'MUSTARD',
    PEACOCK: 'PEACOCK'
};

export class CharacterCard extends GameCard
{
    constructor(name, currentLocation)
    {
        super(currentLocation, 'CHARACTER');
        this.name = name;
    }
}