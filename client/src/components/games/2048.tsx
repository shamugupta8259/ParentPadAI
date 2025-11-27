import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

type Grid = number[][];

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function createEmptyGrid() {
    return Array(4).fill(0).map(() => Array(4).fill(0));
  }

  // Initialize
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    let newGrid = createEmptyGrid();
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  const addRandomTile = (currentGrid: Grid) => {
    const available = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) available.push({ x: i, y: j });
      }
    }
    if (available.length > 0) {
      const spot = available[Math.floor(Math.random() * available.length)];
      currentGrid[spot.x][spot.y] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let moved = false;
    const newGrid = grid.map(row => [...row]);
    let newScore = score;

    // Logic for moving and merging tiles (simplified for brevity)
    // This is a standard 2048 implementation
    const rotate = (g: Grid) => g[0].map((_, i) => g.map(row => row[i]).reverse());
    
    let processGrid = newGrid;
    if (direction === 'right') processGrid = rotate(rotate(newGrid)); // 180
    if (direction === 'down') processGrid = rotate(newGrid); // 90
    if (direction === 'up') processGrid = rotate(rotate(rotate(newGrid))); // 270
    // left is default

    for (let i = 0; i < 4; i++) {
      // 1. Remove zeros
      let row = processGrid[i].filter(x => x !== 0);
      
      // 2. Merge
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          newScore += row[j];
          row.splice(j + 1, 1);
          moved = true;
        }
      }
      
      // 3. Pad zeros
      const oldRowStr = processGrid[i].join(',');
      while (row.length < 4) row.push(0);
      processGrid[i] = row;
      
      if (processGrid[i].join(',') !== oldRowStr) moved = true;
    }

    // Rotate back
    let finalGrid = processGrid;
    if (direction === 'right') finalGrid = rotate(rotate(processGrid));
    if (direction === 'down') finalGrid = rotate(rotate(rotate(processGrid)));
    if (direction === 'up') finalGrid = rotate(processGrid);

    if (moved) {
      addRandomTile(finalGrid);
      setGrid(finalGrid);
      setScore(newScore);
    }
  }, [grid, gameOver, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const getCellColor = (val: number) => {
    const colors: Record<number, string> = {
      2: 'bg-slate-200 text-slate-800',
      4: 'bg-slate-300 text-slate-800',
      8: 'bg-orange-200 text-orange-800',
      16: 'bg-orange-300 text-orange-800',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-red-400 text-white',
      256: 'bg-red-500 text-white',
      512: 'bg-yellow-400 text-white',
      1024: 'bg-yellow-500 text-white',
      2048: 'bg-yellow-600 text-white',
    };
    return colors[val] || 'bg-slate-100';
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between w-full max-w-[320px] items-center">
        <div className="bg-slate-800 text-white p-3 rounded-lg">
          <div className="text-xs uppercase font-bold opacity-70">Score</div>
          <div className="text-2xl font-bold">{score}</div>
        </div>
        <Button onClick={resetGame}>
          <RotateCcw className="mr-2 h-4 w-4" /> New Game
        </Button>
      </div>

      <div className="bg-slate-400 p-4 rounded-xl">
        <div className="grid grid-cols-4 gap-3">
          {grid.map((row, i) => row.map((cell, j) => (
            <div 
              key={`${i}-${j}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-100 ${getCellColor(cell)}`}
            >
              {cell !== 0 && cell}
            </div>
          )))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Use arrow keys to merge tiles
      </div>
    </div>
  );
}
