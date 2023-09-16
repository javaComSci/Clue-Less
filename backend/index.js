import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
export const io = new Server(server);

server.listen(3000, () => {
  	console.log('Server running at http://localhost:3000');
});

// Below is only for testing out initialization of GameState.
import { GameState } from './representations/gameState.js';
import { Player } from '../common/representations/player.mjs';
var game = new GameState('1809d725-d3c0-4ec4-8365-fd40b38236da')
var player1 = new Player('9809d725-d3c0-4ec4-8365-fd40b38236de');
game.addPlayer(player1);
game.printGameState();