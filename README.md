# Multiplayer Checkers Game

A real-time multiplayer checkers game built with React frontend and Node.js backend using Socket.io and MongoDB.

## Features

- Real-time multiplayer gameplay
- Standard checkers rules with king pieces
- Mandatory captures
- Game state persistence in MongoDB
- Responsive web interface

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB (make sure MongoDB is running on your system)

4. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

Frontend will run on http://localhost:3000

## Game Rules

- Red pieces move first
- Pieces can only move diagonally on dark squares
- Regular pieces can only move forward
- Capture opponent pieces by jumping over them
- Pieces become kings when reaching the opposite end
- Kings can move and capture in all diagonal directions
- Player wins by capturing all opponent pieces

## How to Play

1. One player creates a game and shares the Game ID
2. Second player joins using the Game ID
3. Take turns moving pieces by clicking to select and then clicking destination
4. Game ends when one player captures all opponent pieces

"C:\Users\Admin\OneDrive\Pictures\Screenshots\Screenshot 2025-09-14 120035.png"
