import { GamePiece } from './gamePiece.mjs';
import { GameCard } from './gameCard.mjs';
import { LocationConstants } from './location.mjs';

export const CharacterConstants = {
    SCARLET: 'SCARLET',
    PLUM: 'PLUM',
    PEACOCK: 'PEACOCK',
    GREEN: 'GREEN',
    WHITE: 'WHITE',
    MUSTARD: 'MUSTARD'
};

export const CardCharacters = [
    CharacterConstants.SCARLET,
    CharacterConstants.PLUM,
    CharacterConstants.PEACOCK,
    CharacterConstants.GREEN,
    CharacterConstants.WHITE,
    CharacterConstants.MUSTARD
];

export class CharacterPiece extends GamePiece
{
    constructor(name, startingLocation)
    {
        super(name, startingLocation, 'CHARACTER');
        this.priorLocation = LocationConstants.None;
    }
}

export class CharacterCard extends GameCard
{
    constructor(name)
    {
        super(name, 'CHARACTER')
    }
}