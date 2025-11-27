import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const SPEED = 100;

type Point = { x: number, y: number };

export function Snake() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const gameLoop = useCallback((time: number) => {
    if (!isPlaying || gameOver) return;

    if (time - lastTimeRef.current > SPEED) {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y
        };

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        
        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
      lastTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, gameOver, direction, food, generateFood]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, gameOver, gameLoop]);

  // Input handling
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      switch(e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction]);

  // Drawing
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // Draw Snake
    ctx.fillStyle = '#4ade80';
    snake.forEach(p => {
      ctx.fillRect(p.x * CELL_SIZE, p.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    });

    // Draw Food
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE/2, 
      food.y * CELL_SIZE + CELL_SIZE/2, 
      CELL_SIZE/2 - 2, 
      0, 
      Math.PI * 2
    );
    ctx.fill();

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] items-center">
        <div className="text-2xl font-bold">Score: {score}</div>
        {!isPlaying && !gameOver && (
          <Button onClick={resetGame}>
            <Play className="mr-2 h-4 w-4" /> Start Game
          </Button>
        )}
        {gameOver && (
          <Button onClick={resetGame} variant="destructive">
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-muted">
        <canvas 
          ref={canvasRef} 
          width={GRID_SIZE * CELL_SIZE} 
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-3xl font-bold animate-bounce">GAME OVER</div>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Use Arrow Keys to move
      </div>
    </div>
  );
}
