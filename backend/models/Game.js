const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  players: [{
    playerId: String,
    color: { type: String, enum: ['red', 'black'] },
    name: String
  }],
  board: [[Number]], // 8x8 board: 0=empty, 1=red, 2=black, 3=red king, 4=black king
  currentPlayer: { type: String, enum: ['red', 'black'], default: 'red' },
  status: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
  winner: String,
  moves: [{
    from: { row: Number, col: Number },
    to: { row: Number, col: Number },
    captured: [{ row: Number, col: Number }],
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);