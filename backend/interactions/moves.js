import { io } from '../index.js';

export function requestMove(playerId);
{
    moves = [];
    io.to(playerId).emit('Requesting move.', { potentialMoves: moves });
}

export function alertGameCannotStart(gameId)
{
    io.to(gameId).emit('Game cannot start due to game having less than 3 players.');
}