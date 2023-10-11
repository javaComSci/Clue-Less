import { getIOInstance } from '../../index.js';

export function getPerUserRoomId(gameId, playerId)
{
    return `${gameId}-${playerId}`;
}

export function emitGameCannotStart(gameId)
{
    console.log('At least 3 players are required for playing the game.');
    getIOInstance().to(gameId).emit('insufficientPlayerCount');
}

export function emitPlayerStartInfo(gameId, player)
{
    getIOInstance().to(getPerUserRoomId(gameId, player.playerId)).emit('playerStartInfo', player);
}

export function emitGameState(gameId, characterPieces, weaponPieces)
{
    // Only character/weapon pieces need to be emitted as they contain the location that can be used to render.
    getIOInstance().to(gameId).emit('gameState', { characterPieces: characterPieces, weaponPieces: weaponPieces });
}

export function emitRequestMove(gameId, player, potentialMoves)
{
    getIOInstance().to(getPerUserRoomId(gameId, player.playerId)).emit('requestMove', { potentialMoves: potentialMoves });
}
