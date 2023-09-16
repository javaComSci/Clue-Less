export const CharacterConstants = {
    SCARLET: 'SCARLET',
    PLUM: 'PLUM',
    WHITE: 'WHITE',
    GREEN: 'GREEN',
    MUSTARD: 'MUSTARD',
    PEACOCK: 'PEACOCK'
};

export class Character
{
    constructor(characterName, currentLocation)
    {
        this.characterName = characterName;
        this.currentLocation = currentLocation;
    }
}