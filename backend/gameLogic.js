class CheckersGame {
  static initializeBoard() {
    const board = Array(8).fill().map(() => Array(8).fill(0));
    
    // Place red pieces (player 1)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = 1;
        }
      }
    }
    
    // Place black pieces (player 2)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = 2;
        }
      }
    }
    
    return board;
  }

  static isValidMove(board, from, to, player) {
    const { row: fromRow, col: fromCol } = from;
    const { row: toRow, col: toCol } = to;
    
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
    if (board[toRow][toCol] !== 0) return false;
    
    const piece = board[fromRow][fromCol];
    const playerPieces = player === 'red' ? [1, 3] : [2, 4];
    
    if (!playerPieces.includes(piece)) return false;
    
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    
    // Regular piece movement
    if (piece === 1 || piece === 2) {
      const direction = piece === 1 ? 1 : -1;
      
      // Simple move
      if (Math.abs(rowDiff) === 1 && colDiff === 1) {
        return piece === 1 ? rowDiff > 0 : rowDiff < 0;
      }
      
      // Capture move
      if (Math.abs(rowDiff) === 2 && colDiff === 2) {
        const midRow = fromRow + rowDiff / 2;
        const midCol = fromCol + (toCol - fromCol) / 2;
        const midPiece = board[midRow][midCol];
        
        const opponentPieces = player === 'red' ? [2, 4] : [1, 3];
        return opponentPieces.includes(midPiece);
      }
    }
    
    // King movement
    if (piece === 3 || piece === 4) {
      if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        // Check path is clear for kings
        const rowStep = rowDiff > 0 ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        let capturedCount = 0;
        
        while (currentRow !== toRow) {
          if (board[currentRow][currentCol] !== 0) {
            capturedCount++;
            const opponentPieces = player === 'red' ? [2, 4] : [1, 3];
            if (!opponentPieces.includes(board[currentRow][currentCol]) || capturedCount > 1) {
              return false;
            }
          }
          currentRow += rowStep;
          currentCol += colStep;
        }
        
        return true;
      }
    }
    
    return false;
  }

  static makeMove(board, from, to, player) {
    const newBoard = board.map(row => [...row]);
    const { row: fromRow, col: fromCol } = from;
    const { row: toRow, col: toCol } = to;
    
    const piece = newBoard[fromRow][fromCol];
    const captured = [];
    
    // Move piece
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = 0;
    
    // Handle captures
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    
    if (Math.abs(rowDiff) > 1) {
      const rowStep = rowDiff > 0 ? 1 : -1;
      const colStep = colDiff > 0 ? 1 : -1;
      
      let currentRow = fromRow + rowStep;
      let currentCol = fromCol + colStep;
      
      while (currentRow !== toRow) {
        if (newBoard[currentRow][currentCol] !== 0) {
          captured.push({ row: currentRow, col: currentCol });
          newBoard[currentRow][currentCol] = 0;
        }
        currentRow += rowStep;
        currentCol += colStep;
      }
    }
    
    // Promote to king
    if ((piece === 1 && toRow === 7) || (piece === 2 && toRow === 0)) {
      newBoard[toRow][toCol] = piece + 2;
    }
    
    return { board: newBoard, captured };
  }

  static checkWinner(board) {
    let redPieces = 0;
    let blackPieces = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece === 1 || piece === 3) redPieces++;
        if (piece === 2 || piece === 4) blackPieces++;
      }
    }
    
    if (redPieces === 0) return 'black';
    if (blackPieces === 0) return 'red';
    return null;
  }
}

module.exports = CheckersGame;