import { GameState } from '../representations/gameState.js';
import { getIOInstance } from '../index.js';

// Keep the games object as global to map the gameId to game instance.
let games = {};

export function initializeGameStart()
{
    getIOInstance().on('connection', (socket) => {
        console.log('A user connected.');

        // Id of game to join must be provided by client.
        // For now, the gameId is to be hard-coded by client as there is only single game instance.
        socket.on('start', ({ gameId, player }, callback) => {
            console.log(`Getting the game start request for game ${gameId}, player: ${JSON.stringify(player)}.`);

            // Join game room.
            // This will be used for emitting information to all players in the game.
            socket.join(gameId);
    
            // Join room with just this player.
            // This will be used for emitting to just this player.
            socket.join(player.playerId);

            if (!(gameId in games)){
                console.log('Starting up timer for starting up the game.');

                // Start up a timer to start the game in 1 min.
                setTimeout(() => {
                    console.log('1 minute has elapsed. Starting game if possible.');
                    games[gameId].startGame();
                  }, '10000');
                
                games[gameId] = new GameState(gameId);
            }
        
            // Expecting a player object to be sent from client with the playerId.
            // Rest of player info will be filled out by server.
            games[gameId].addPlayer(player);
            
            callback(player);
        });
    });
}