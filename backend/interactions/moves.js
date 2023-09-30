import { getIOInstance } from '../index.js';

export function requestMove(playerId)
{
    let moves = [];
    getIOInstance().to(playerId).emit('Requesting move.', { potentialMoves: moves });
}

export function emitGameCannotStart(gameId)
{
    console.log('At least 3 players are required for playing the game.');
    getIOInstance().to(gameId).emit('insufficientPlayerCount');
}