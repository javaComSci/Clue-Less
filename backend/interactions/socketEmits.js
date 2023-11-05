import { getIOInstance } from '../../index.js';

export function logToConsole(message)
{
    let shouldLog = true;
    if (shouldLog)
    {
        console.log(message);
    }
}

export function getPerUserRoomId(gameId, playerId)
{
    return `${gameId}-${playerId}`;
}

export function emitGameCannotStart(gameId)
{
    logToConsole('At least 3 players are required for playing the game.');
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
    logToConsole(`REQUEST: GAME MOVE from player ${currentPlayer.playerId}. Available moves: ${potentialMoves}.`);
    getIOInstance().to(gameId).emit('REQUESTING_MOVE_BROADCAST', { playerId: currentPlayer.playerId });
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('REQUEST_MOVE', { potentialMoves: potentialMoves });
}

export function emitRequestSuggestion(gameId, currentPlayer)
{
    logToConsole(`REQUEST: SUGGESTION from player ${currentPlayer.playerId}`)
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('REQUEST_SUGGESTION');
}

export function emitRequestProof(gameId, proofRequestedPlayer, proofSuggestion)
{
    logToConsole(`REQUEST: PROOF from player ${proofRequestedPlayer.playerId}`)
    getIOInstance().to(getPerUserRoomId(gameId, proofRequestedPlayer.playerId)).emit('REQUEST_PROOF', proofSuggestion);
}

export function emitIsProofProvided(gameId, isProofProvided, proofProviderPlayerId)
{
    getIOInstance().to(gameId).emit('IS_PROOF_PROVIDED', { isProofProvided: isProofProvided, proofProviderPlayerId: proofProviderPlayerId });
}

export function emitProofProvided(gameId, currentPlayer, proofProviderPlayerId)
{
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('PROOF_PROVIDED', { proofProviderPlayerId: proofProviderPlayerId });
}

export function emitAccusationCorrect(gameId, winningPlayer, accusedCharacter, accusedWeapon, accusedLocation)
{
    console.log(`ACCUSATION: ${accusedCharacter} in ${accusedLocation} with ${accusedWeapon} is correct. PLAYER ${winningPlayer.playerId} WON! GAME OVER!`);
    getIOInstance().to(gameId).emit('ACCUSATION_CORRECT', { winningPlayer: winningPlayer.playerId, accusedCharacter: accusedCharacter, accusedWeapon: accusedWeapon, accusedLocation: accusedLocation });
}