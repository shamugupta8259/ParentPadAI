import React, { useState } from "react";

// A simple, static Sudoku puzzle and its solution
const initialPuzzle = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

const solution = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

const Sudoku: React.FC = () => {
  const [board, setBoard] = useState(initialPuzzle);
  const [completed, setCompleted] = useState(false);

  const handleChange = (row: number, col: number, value: string) => {
    if (initialPuzzle[row][col] !== null) return; // Don't allow editing pre-filled cells
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 9) return;
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? num : cell))
    );
    setBoard(newBoard);
    // Check if solved
    if (JSON.stringify(newBoard) === JSON.stringify(solution)) {
      setCompleted(true);
    }
  };

  const reset = () => {
    setBoard(initialPuzzle);
    setCompleted(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2 className="text-xl font-bold mb-2">Sudoku</h2>
      <div className="mb-4">
        Fill the grid so every row, column, and 3x3 box contains 1-9.
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 32px)",
          gap: 2,
          background: "#eee",
          padding: 4,
          borderRadius: 8,
        }}
      >
        {board.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              value={cell === null ? "" : cell}
              onChange={(e) => handleChange(i, j, e.target.value)}
              disabled={initialPuzzle[i][j] !== null || completed}
              maxLength={1}
              style={{
                width: 30,
                height: 30,
                textAlign: "center",
                fontWeight: initialPuzzle[i][j] !== null ? "bold" : "normal",
                background:
                  initialPuzzle[i][j] !== null
                    ? "#f3f3f3"
                    : completed
                    ? "#d4ffd4"
                    : "#fff",
                border:
                  (i % 3 === 2 && i !== 8
                    ? "2px solid #bbb"
                    : "1px solid #ccc") +
                  " " +
                  (j % 3 === 2 && j !== 8
                    ? "2px solid #bbb"
                    : "1px solid #ccc"),
                borderRadius: 4,
                fontSize: 16,
              }}
              inputMode="numeric"
              pattern="[1-9]"
            />
          ))
        )}
      </div>
      {completed && (
        <div className="mt-4 text-green-600 font-bold">
          Congratulations! You solved it!
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
};

export default Sudoku;
