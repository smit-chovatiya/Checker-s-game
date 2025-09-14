import React, { useState } from 'react';
import './GameLobby.css';

const GameLobby = ({ onCreateGame, onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState('create');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (mode === 'create') {
      onCreateGame(playerName);
    } else {
      if (!gameId.trim()) {
        alert('Please enter game ID');
        return;
      }
      onJoinGame(gameId, playerName);
    }
  };

  return (
    <div className="game-lobby">
      <div className="lobby-container">
        <div className="mode-selector">
          <button 
            className={mode === 'create' ? 'active' : ''}
            onClick={() => setMode('create')}
          >
            Create Game
          </button>
          <button 
            className={mode === 'join' ? 'active' : ''}
            onClick={() => setMode('join')}
          >
            Join Game
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Your Name:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {mode === 'join' && (
            <div className="input-group">
              <label>Game ID:</label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter game ID"
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {mode === 'create' ? 'Create Game' : 'Join Game'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameLobby;