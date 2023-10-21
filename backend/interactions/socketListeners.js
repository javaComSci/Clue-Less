import { getIOInstance } from '../index.js';
import { GameEngine } from '../engine/gameEngine.js';
import { getPerUserRoomId } from './socketEmits.js';

// Keep the games object as global to map the gameId to game instance.
let games = {};

export function initializeListeners()
{
    getIOInstance().on('connection', (socket) => {
        console.log('A user connected.');

        // Id of game to join must be provided by client.
        // For now, the gameId is to be hard-coded by client as there is only single game instance.
        socket.on('start', ({ gameId, playerId }) => {
            console.log(`Getting the game start request for game ${gameId}, player: ${playerId}.`);

            // Join game room.
            // This will be used for emitting information to all players in the game.
            socket.join(gameId);
    
            // Join room with just this player.
            // This will be used for emitting to just this player.
            socket.join(getPerUserRoomId(gameId, playerId));

            if (!(gameId in games)){
                console.log('Starting up timer for game start.');

                // Start up a timer to start the game in 1 min.
                setTimeout(() => {
                    console.log('Timer has elapsed. Starting game if possible.');
                    games[gameId].startGame();
                  }, '10000');
                
                games[gameId] = new GameEngine(gameId);
            }
            
            // Player with the id is added to the game.
            games[gameId].addPlayer(playerId);
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
    });
}