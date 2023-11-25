import { GamePiece } from './gamePiece.mjs';
import { GameCard } from './gameCard.mjs';

export const WeaponConstants = {
    CANDLESTICK: 'CANDLESTICK',
    KNIFE: 'KNIFE',
    PIPE: 'PIPE',
    REVOLVER: 'REVOLVER',
    ROPE: 'ROPE',
    WRENCH: 'WRENCH'
};

export const CardWeapons = [
    WeaponConstants.CANDLESTICK,
    WeaponConstants.DRAGGER,
    WeaponConstants.PIPE,
    WeaponConstants.REVOLVER,
    WeaponConstants.ROPE,
    WeaponConstants.WRENCH
];

export class WeaponPiece extends GamePiece
{
    constructor(name, currentLocation)
    {
        super(name, currentLocation, 'WEAPON');
    }
}

export class WeaponCard extends GameCard
{
    constructor(name)
    {
        super(name, 'WEAPON')
    }
}
