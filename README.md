# Tic-Tac-Toe with Move Timer and Score Tracking

A two-player tic-tac-toe game built with React

## Features

- Move History
- A 10-second move timer. Running out of time loses the round.
- A pause button that stops the clock and locks the board.
- Score tracking for X wins, O wins, and draws across rounds.
- Draw detection and a "New round" button.
- A restyled UI.

## Setup

Requires [Node.js](https://nodejs.org/) 18 or later.

```bash
git clone <your-repo-url>
cd <your-repo-folder>
npm install
npm start
```

Then open http://localhost:3000.

## How to Play

X moves first. Get three in a row to win, and make each move within 10 seconds. Click any entry in the move list to review earlier moves.

To change the time limit, edit `TURN_SECONDS` at the top of `src/App.js`.

## Acknowledgments

Based on the [React Tic-Tac-Toe tutorial](https://react.dev/learn/tutorial-tic-tac-toe).