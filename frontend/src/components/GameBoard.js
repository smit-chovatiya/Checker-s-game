import React, { useState } from 'react';
import './GameBoard.css';

const GameBoard = ({ board, onMove, playerColor, currentPlayer, gameFinished }) => {
  const [selectedSquare, setSelectedSquare] = useState(null);

  const handleSquareClick = (row, col) => {
    if (gameFinished || currentPlayer !== playerColor) return;

    if (selectedSquare) {
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }

      const piece = board[selectedSquare.row][selectedSquare.col];
      const playerPieces = playerColor === 'red' ? [1, 3] : [2, 4];
      
      if (playerPieces.includes(piece)) {
        onMove(selectedSquare, { row, col });
        setSelectedSquare(null);
      }
    } else {
      const piece = board[row][col];
      const playerPieces = playerColor === 'red' ? [1, 3] : [2, 4];
      
      if (playerPieces.includes(piece)) {
        setSelectedSquare({ row, col });
      }
    }
  };

  const getPieceClass = (piece) => {
    switch (piece) {
      case 1: return 'piece red';
      case 2: return 'piece black';
      case 3: return 'piece red king';
      case 4: return 'piece black king';
      default: return '';
    }
  };

  const isSelected = (row, col) => {
    return selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`square ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'} ${
                isSelected(rowIndex, colIndex) ? 'selected' : ''
              }`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {piece !== 0 && (
                <div className={getPieceClass(piece)}>
                  {(piece === 3 || piece === 4) && <span className="crown">♔</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;