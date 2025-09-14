import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GameBoard from './components/GameBoard';
import GameLobby from './components/GameLobby';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [gameState, setGameState] = useState('lobby');
  const [gameData, setGameData] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on('gameCreated', (data) => {
      setGameState('waiting');
      setGameData(data);
      setPlayerColor(data.color);
    });

    socket.on('gameStarted', (data) => {
      setGameState('playing');
      setGameData(data);
      setCurrentPlayer(data.currentPlayer);
      setPlayerColor(prev => prev || 'black');
    });

    socket.on('moveMade', (data) => {
      setGameData(prev => ({ ...prev, board: data.board }));
      setCurrentPlayer(data.currentPlayer);
      if (data.winner) {
        setWinner(data.winner);
        setGameState('finished');
      }
    });

    socket.on('error', (message) => {
      alert(message);
    });

    return () => {
      socket.off('gameCreated');
      socket.off('gameStarted');
      socket.off('moveMade');
      socket.off('error');
    };
  }, []);

  const createGame = (playerName) => {
    socket.emit('createGame', playerName);
  };

  const joinGame = (gameId, playerName) => {
    socket.emit('joinGame', { gameId, playerName });
  };

  const makeMove = (from, to) => {
    socket.emit('makeMove', { gameId: gameData.gameId, from, to });
  };

  return (
    <div className="App">
      <h1>Multiplayer Checkers</h1>
      
      {gameState === 'lobby' && (
        <GameLobby onCreateGame={createGame} onJoinGame={joinGame} />
      )}
      
      {gameState === 'waiting' && (
        <div className="waiting">
          <p>Waiting for another player...</p>
          <p>Game ID: {gameData?.gameId}</p>
        </div>
      )}
      
      {(gameState === 'playing' || gameState === 'finished') && gameData && (
        <div>
          <div className="game-info">
            <p>You are: {playerColor}</p>
            <p>Current turn: {currentPlayer}</p>
            {winner && <p className="winner">Winner: {winner}!</p>}
          </div>
          <GameBoard 
            board={gameData.board} 
            onMove={makeMove}
            playerColor={playerColor}
            currentPlayer={currentPlayer}
            gameFinished={gameState === 'finished'}
          />
        </div>
      )}
    </div>
  );
}

export default App;