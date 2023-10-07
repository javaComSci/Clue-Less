import { getIOInstance } from '../index.js';

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
    getIOInstance().to(getPerUserRoomId(gameId, player.playerId)).emit('PLAYER_START_INFO', player);
}

export function emitGameState(gameId, characterPieces, weaponPieces)
{
    // Only character/weapon pieces need to be emitted as they contain the location that can be used to render.
    getIOInstance().to(gameId).emit('GAME_STATE', { characterPieces: characterPieces, weaponPieces: weaponPieces });
}

export function emitRequestMove(gameId, currentPlayer, potentialMoves)
{
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('REQUEST_MOVE', { potentialMoves: potentialMoves });
}

export function emitRequestSuggestion(gameId, currentPlayer)
{
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('REQUEST_SUGGESTION');
}

export function emitRequestProof(gameId, proofRequestedPlayer)
{
    getIOInstance().to(getPerUserRoomId(gameId, proofRequestedPlayer.playerId)).emit('REQUEST_PROOF');
}

export function emitIsProofProvided(gameId, isProofProvided, proofProviderPlayerId)
{
    getIOInstance().to(gameId).emit('IS_PROOF_PROVIDED', { isProofProvided: isProofProvided, proofProviderPlayerId: proofProviderPlayerId });
}

export function emitProofProvided(gameId, currentPlayer, proofProviderPlayerId)
{
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('PROOF_PROVIDED', { proofProviderPlayerId: proofProviderPlayerId });
}