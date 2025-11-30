import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Circle, X } from "lucide-react";
import Tetris from "./Tetris";
import Sudoku from "./Sudoku";
import Chess from "./Chess";
import StackTower from "./StackTower";
import Wordle from "./Wordle";
import TicTacToeGame from "./TicTacToe";
import Solitaire from "./Solitaire";
import ConnectFour from "./ConnectFour";

// --- Tic Tac Toe ---
export function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  function handleClick(i: number) {
    if (winner || board[i]) return;
    const nextBoard = [...board];
    nextBoard[i] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-xl font-bold mb-4">
        {winner ? (
          <span className="text-green-600">Winner: {winner}</span>
        ) : isDraw ? (
          <span className="text-orange-600">Draw!</span>
        ) : (
          <span>Next Player: {xIsNext ? "X" : "O"}</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 bg-muted p-2 rounded-xl">
        {board.map((cell, i) => (
          <button
            key={i}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-background rounded-lg flex items-center justify-center text-4xl font-bold hover:bg-accent transition-colors"
            onClick={() => handleClick(i)}
            disabled={!!winner || !!cell}
          >
            {cell === "X" && <X className="h-12 w-12 text-blue-500" />}
            {cell === "O" && <Circle className="h-10 w-10 text-red-500" />}
          </button>
        ))}
      </div>

      <Button onClick={reset} variant="outline" size="lg">
        <RefreshCw className="mr-2 h-4 w-4" /> Reset Game
      </Button>
    </div>
  );
}

function calculateWinner(squares: any[]) {
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

// --- Rock Paper Scissors ---
export function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ user: 0, computer: 0 });

  const choices = [
    { id: "rock", icon: "🪨" },
    { id: "paper", icon: "📄" },
    { id: "scissors", icon: "✂️" },
  ];

  const play = (choice: string) => {
    const computer = choices[Math.floor(Math.random() * choices.length)].id;
    setUserChoice(choice);
    setComputerChoice(computer);

    if (choice === computer) {
      setResult("Draw!");
    } else if (
      (choice === "rock" && computer === "scissors") ||
      (choice === "paper" && computer === "rock") ||
      (choice === "scissors" && computer === "paper")
    ) {
      setResult("You Win!");
      setScore((s) => ({ ...s, user: s.user + 1 }));
    } else {
      setResult("You Lose!");
      setScore((s) => ({ ...s, computer: s.computer + 1 }));
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto">
      <div className="flex justify-between w-full px-8 py-4 bg-muted rounded-xl">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">You</div>
          <div className="text-3xl font-bold">{score.user}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Computer</div>
          <div className="text-3xl font-bold">{score.computer}</div>
        </div>
      </div>

      <div className="h-32 flex items-center justify-center text-2xl font-bold">
        {result || "Choose your weapon!"}
      </div>

      <div className="flex gap-4">
        {choices.map((c) => (
          <button
            key={c.id}
            onClick={() => play(c.id)}
            className="w-20 h-20 text-4xl bg-background border-2 hover:border-primary rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
          >
            {c.icon}
          </button>
        ))}
      </div>

      {userChoice && (
        <div className="flex gap-8 text-sm text-muted-foreground">
          <div>You chose: {choices.find((c) => c.id === userChoice)?.icon}</div>
          <div>
            CPU chose: {choices.find((c) => c.id === computerChoice)?.icon}
          </div>
        </div>
      )}
    </div>
  );
}

export function PopularGamesCollection() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold mb-4">Most Popular Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <Tetris />
        </Card>
        <Card>
          <Sudoku />
        </Card>
        <Card>
          <Chess />
        </Card>
        <Card>
          <StackTower />
        </Card>
        <Card>
          <Wordle />
        </Card>
        <Card>
          <TicTacToeGame />
        </Card>
        <Card>
          <ConnectFour />
        </Card>
      </div>
    </div>
  );
}
