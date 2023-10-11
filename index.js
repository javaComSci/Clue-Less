import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { initializeListeners } from './backend/interactions/socketListeners.js';

const app = express();
const server = createServer(app);

var io;
export var getIOInstance = function()
{
  return io;
};

var io = new Server(server);
initializeListeners();

server.listen(3000, () => {
  	console.log('Server running at http://localhost:3000');
});

app.use(express.static('frontend'));
/*
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import path from 'path';
import { fileURLToPath } from 'url';
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/../frontend/html/index.html');
});
app.use('/js', express.static(__dirname + '/../frontend/js'));
app.use('/assets', express.static(__dirname + '/../frontend/assets'));
*/

// Below is only for testing out initialization of GameState.
// import { GameState } from './representations/gameState.js';
// import { Player } from '../common/representations/player.mjs';
// var game = new GameState('1809d725-d3c0-4ec4-8365-fd40b38236da')
// var player1 = new Player('9809d725-d3c0-4ec4-8365-fd40b38236de');
// game.addPlayer(player1);
// game.printGameState();
