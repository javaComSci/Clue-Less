import { io } from '../index';
import { GameState } from '../representations/gameState.mjs';

// Initially, there will only be one instance of the game that can be played.
// Thus, keep the game state as global.
currentGameState = undefined;

io.on('start', player, callback => {
	if (currentGameState === undefined)
    {
        // Start up a timer to start the game in 1 min.
        setTimeout(() => {
            console.log('1 minute has elapsed. Starting game if possible.');
            currentGameState.startGame();
          }, '60000');
        
        currentGameState = GameState();
    }

    // Expecting a player object to be sent from client with the playerId.
    // Rest of player info will be filled out by server.
    currentGameState.addPlayer(player);

    callback(player);
});