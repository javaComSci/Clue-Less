import { io } from '../index.js';
import { GameState } from '../representations/gameState.js';

// Keep the games object as global to map the gameId to game instance.
games = {};

io.on('connection', (socket) => {

    // Id of game to join must be provided by client.
    // For now, the gameId is to be hard-coded by client as there is only single game instance.
    socket.on('start', ({ gameId, player }, callback) => {

        // Join game room.
        socket.join(gameId);

        // Join room with just single player.
        socket.join(player.playerId);

        if (!(gameId in games)){
            // Start up a timer to start the game in 1 min.
            setTimeout(() => {
                console.log('1 minute has elapsed. Starting game if possible.');
                games[gameId].startGame();
              }, '60000');
            
            games[gameId] = GameState(gameId);
        }
    
        // Expecting a player object to be sent from client with the playerId.
        // Rest of player info will be filled out by server.
        games[gameId].addPlayer(player);
    
        callback(player);
    });
});