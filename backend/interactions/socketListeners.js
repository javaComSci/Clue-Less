import { getIOInstance } from '../../index.js';
import { GameEngine } from '../engine/gameEngine.js';
import { getPerUserRoomId, getGameSocketId, emitPlayers, emitNavigateToGameBoard } from './socketEmits.js';

// Keep the games object as global to map the gameId to game instance.
let games = {};

function isPlayerExisting(playerId)
{
    for (const game in games)
    {
        console.log(games[game].players);

        for (const player in games[game].players)
        {
            if (games[game].players[player].playerId == playerId)
            {
                return true;
            }
        }
    }
    return false;
}

export function initializeListeners()
{
    getIOInstance().on('connection', (socket) => {
        console.log('A user connected.');

        socket.on('joinExistingGame', ({ gameId, playerId }, callback) => {
            console.log(`Getting the game join request for game ${gameId}, player: ${playerId}.`);

            // Callback will be called to notifying whether the player could be added to the game or not.
            if(!(gameId in games))
            {
                callback("No game");
            }
            else if (isPlayerExisting(playerId))
            {
                callback("Existing player");
            }
            else
            {
                socket.join(getGameSocketId(gameId));
                socket.join(getPerUserRoomId(gameId, playerId));
                games[gameId].addPlayer(playerId);
                callback("Joined");
                emitPlayers(gameId, games[gameId].players);
            }
        });

        socket.on('createNewGame', ({ gameId, playerId }, callback) => {
            console.log(`Getting the game create request for game ${gameId}, player: ${playerId}.`);

            // Callback will be called to notifying whether the game was successfully created or not.
            if((gameId in games))
            {
                callback("Existing game");
            }
            else if (isPlayerExisting(playerId))
            {
                callback("Existing player");
            }
            else
            {
                socket.join(getGameSocketId(gameId));
                socket.join(getPerUserRoomId(gameId, playerId));
                games[gameId] = new GameEngine(gameId);
                games[gameId].addPlayer(playerId);
                callback("Created");
                emitPlayers(gameId, games[gameId].players);
            }
        });

        socket.on('start', ({ gameId, playerId }, callback) => {
            console.log(`Getting the game start request for game ${gameId}, player: ${playerId}.`);

            if (games[gameId].players.length >= 3) {
                emitNavigateToGameBoard(gameId);
                games[gameId].startGame();
                callback(true);
            }
            else {
                callback(false);
            }
        });

        socket.on('move', ({ gameId, playerId, newCharacterLocation }) => {
            games[gameId].processMove(playerId, newCharacterLocation);
        });

        socket.on('suggestion', ({ gameId, playerId, suggestedCharacterName, suggestedWeaponName }) => {
            games[gameId].processSuggestion(playerId, suggestedCharacterName, suggestedWeaponName);
        });

        socket.on('proof', ({ gameId, playerId, proofCard }) => {
            games[gameId].processProof(playerId, proofCard);
        });

        socket.on('accuse', ({ gameId, playerId, accusingCharacter, accusingWeapon, accusingLocation }) => {
            games[gameId].processAccusation(playerId, accusingCharacter, accusingWeapon, accusingLocation);
        });

        socket.on('turncomplete', ({ gameId, playerId }) => {
            games[gameId].processTurnCompletion(playerId);
        });
    });
}
