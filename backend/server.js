const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Game = require('./models/Game');
const CheckersGame = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/checkers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const games = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createGame', async (playerName) => {
    const gameId = Math.random().toString(36).substr(2, 9);
    const board = CheckersGame.initializeBoard();
    
    const game = new Game({
      gameId,
      players: [{ playerId: socket.id, color: 'red', name: playerName }],
      board,
      currentPlayer: 'red',
      status: 'waiting'
    });
    
    await game.save();
    games.set(gameId, game);
    
    socket.join(gameId);
    socket.emit('gameCreated', { gameId, color: 'red', board });
  });

  socket.on('joinGame', async (data) => {
    const { gameId, playerName } = data;
    let game = games.get(gameId) || await Game.findOne({ gameId });
    
    if (!game || game.players.length >= 2) {
      socket.emit('error', 'Game not found or full');
      return;
    }
    
    game.players.push({ playerId: socket.id, color: 'black', name: playerName });
    game.status = 'playing';
    await game.save();
    
    games.set(gameId, game);
    socket.join(gameId);
    
    io.to(gameId).emit('gameStarted', {
      gameId: game.gameId,
      board: game.board,
      currentPlayer: game.currentPlayer,
      players: game.players
    });
  });

  socket.on('makeMove', async (data) => {
    const { gameId, from, to } = data;
    let game = games.get(gameId) || await Game.findOne({ gameId });
    
    if (!game) {
      socket.emit('error', 'Game not found');
      return;
    }
    
    if (game.status !== 'playing') {
      socket.emit('error', 'Game not started');
      return;
    }
    
    const player = game.players.find(p => p.playerId === socket.id);
    if (!player || player.color !== game.currentPlayer) {
      socket.emit('error', 'Not your turn');
      return;
    }
    
    if (!CheckersGame.isValidMove(game.board, from, to, player.color)) {
      socket.emit('error', 'Invalid move');
      return;
    }
    
    const result = CheckersGame.makeMove(game.board, from, to, player.color);
    game.board = result.board;
    game.moves.push({ from, to, captured: result.captured });
    
    const winner = CheckersGame.checkWinner(game.board);
    if (winner) {
      game.status = 'finished';
      game.winner = winner;
    } else {
      game.currentPlayer = game.currentPlayer === 'red' ? 'black' : 'red';
    }
    
    await game.save();
    
    io.to(gameId).emit('moveMade', {
      board: game.board,
      currentPlayer: game.currentPlayer,
      winner: game.winner,
      lastMove: { from, to, captured: result.captured }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});