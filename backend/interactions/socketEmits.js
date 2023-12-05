import { getIOInstance } from '../../index.js';
import { deleteGameInstance } from './socketListeners.js';

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

export function getGameSocketId(gameId)
{
    return `$GAME-${gameId};`
}

export function emitGameCannotStart(gameId)
{
    logToConsole('At least 3 players are required for playing the game.');
    getIOInstance().to(getGameSocketId(gameId)).emit('insufficientPlayerCount');
}

export function emitPlayers(gameId, players)
{
    getIOInstance().to(getGameSocketId(gameId)).emit('GAME_PLAYERS', { players: players });
}

export function emitNavigateToGameBoard(gameId)
{
    getIOInstance().to(getGameSocketId(gameId)).emit('SHOW_GAME_BOARD', {});
}

export function emitPlayerStartInfo(gameId, player)
{
    getIOInstance().to(getPerUserRoomId(gameId, player.playerId)).emit('PLAYER_START_INFO', player);
}

export function emitGameState(gameId, characterPieces, weaponPieces)
{
    // Only character/weapon pieces need to be emitted as they contain the location that can be used to render.
    getIOInstance().to(getGameSocketId(gameId)).emit('GAME_STATE', { characterPieces: characterPieces, weaponPieces: weaponPieces });
}

export function emitRequestMove(gameId, currentPlayer, potentialMoves)
{
    logToConsole(`REQUEST: GAME MOVE from player ${currentPlayer.playerId}. Available moves: ${potentialMoves}.`);
    getIOInstance().to(getGameSocketId(gameId)).emit('REQUESTING_MOVE_BROADCAST', { playerId: currentPlayer.playerId, name: currentPlayer.character.name });
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('REQUEST_MOVE', { potentialMoves: potentialMoves });
}

export function emitRequestSuggestion(gameId, currentPlayer)
{
    logToConsole(`REQUEST: SUGGESTION from player ${currentPlayer.playerId}`)
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('REQUEST_SUGGESTION');
}

export function emitSuggestionWasProvided(gameId, currentPlayer)
{
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('SUGGESTION_PROVIDED');
}

export function emitRequestProof(gameId, proofRequestedPlayer, proofSuggestion)
{
    logToConsole(`REQUEST: PROOF from player ${proofRequestedPlayer.playerId}`);
    getIOInstance().to(getGameSocketId(gameId)).emit('REQUESTING_PROOF_BROADCAST', { playerId: proofRequestedPlayer.playerId });
    getIOInstance().to(getPerUserRoomId(gameId, proofRequestedPlayer.playerId)).emit('REQUEST_PROOF', proofSuggestion);
}

export function emitIsProofProvided(gameId, isProofProvided, proofProviderPlayerId)
{
    logToConsole(`BROADCAST: PROOF was provided by player ${proofProviderPlayerId}`)
    getIOInstance().to(getGameSocketId(gameId)).emit('IS_PROOF_PROVIDED', { isProofProvided: isProofProvided, proofProviderPlayerId: proofProviderPlayerId });
}

export function emitProofProvided(gameId, currentPlayer, proofProviderPlayerId)
{
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('PROOF_PROVIDED', { proofProviderPlayerId: proofProviderPlayerId });
}

export function emitRequestPlayerTurnCompleteConfirmation(gameId, currentPlayer)
{
    logToConsole(`REQUEST: TURN COMPLETION CONFIRMATION from player ${currentPlayer.playerId}`);
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('REQUEST_TURN_COMPLETE_CONFIRM');
}

export function emitAccusationCorrect(gameId, winningPlayer, accusedCharacter, accusedWeapon, accusedLocation)
{
    console.log(`ACCUSATION: ${accusedCharacter} in ${accusedLocation} with ${accusedWeapon} is correct. PLAYER ${winningPlayer.playerId} WON! GAME OVER!`);
    getIOInstance().to(getGameSocketId(gameId)).emit('ACCUSATION_CORRECT', { winningPlayer: winningPlayer, accusedCharacter: accusedCharacter, accusedWeapon: accusedWeapon, accusedLocation: accusedLocation });

    // As game is over, delete game istance
    deleteGameInstance(gameId);
}

export function emitAccusationIncorrect(gameId, currentPlayer, accusedCharacter, accusedWeapon, accusedLocation, correctCharacter, correctWeapon, correctLocation, isGameOver)
{
    getIOInstance().to(getPerUserRoomId(gameId, currentPlayer.playerId)).emit('ACCUSATION_SOLUTION', { correctCharacter: correctCharacter, correctWeapon: correctWeapon, correctLocation: correctLocation });
    getIOInstance().to(getGameSocketId(gameId)).emit('ACCUSATION_INCORRECT', { accusingPlayer: currentPlayer, accusedCharacter: accusedCharacter, accusedWeapon: accusedWeapon, accusedLocation: accusedLocation, isGameOver: isGameOver });

    console.log(`ACCUSATION: ${accusedCharacter} in ${accusedLocation} with ${accusedWeapon} is incorrect. Player ${currentPlayer.playerId} can no longer make any moves`);
    if (isGameOver)
    {
        console.log(`GAME IS OVER. NO ONE WON.`);
        // As game is over, delete game instance
        deleteGameInstance(gameId);
    }
}
