import { useState, useEffect } from "react";

const TURN_SECONDS = 10;

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, locked, winnerByTime }) {
  function handleClick(i) {
    if (locked || calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winnerByTime) {
    status = "Winner: " + winnerByTime + " (on time)";
  } else if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(Boolean)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [roundOver, setRoundOver] = useState(false);
  const [winnerByTime, setWinnerByTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);
  const [paused, setPaused] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Countdown: ticks once per second unless paused or the round is over
  useEffect(() => {
    if (paused || roundOver) return;
    if (timeLeft === 0) {
      const winner = xIsNext ? "O" : "X";
      setWinnerByTime(winner);
      setRoundOver(true);
      setScores((s) => ({ ...s, [winner]: s[winner] + 1 }));
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, paused, roundOver, xIsNext]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setTimeLeft(TURN_SECONDS);

    const winner = calculateWinner(nextSquares);
    if (winner) {
      setRoundOver(true);
      setScores((s) => ({ ...s, [winner]: s[winner] + 1 }));
    } else if (nextSquares.every(Boolean)) {
      setRoundOver(true);
      setScores((s) => ({ ...s, draw: s.draw + 1 }));
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    if (!roundOver) setTimeLeft(TURN_SECONDS);
  }

  function newRound() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setRoundOver(false);
    setWinnerByTime(null);
    setTimeLeft(TURN_SECONDS);
    setPaused(false);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          locked={roundOver || paused}
          winnerByTime={winnerByTime}
        />
      </div>
      <div className="game-info">
        <div className="scores">
          X: {scores.X} &nbsp; O: {scores.O} &nbsp; Draws: {scores.draw}
        </div>
        <div className="timer">
          {roundOver ? "Round over" : paused ? "Paused" : timeLeft + "s left"}
        </div>
        <div className="controls">
          <button onClick={() => setPaused(!paused)} disabled={roundOver}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={newRound}>New round</button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
