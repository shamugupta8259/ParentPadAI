import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;
const BALL_RADIUS = 5;
const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 8;
const BRICK_WIDTH = 50; // Adjusted for padding
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 5; // Centering adjustment

type Brick = { x: number, y: number, status: number };

export function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Game State Refs (for loop performance)
  const x = useRef(CANVAS_WIDTH / 2);
  const y = useRef(CANVAS_HEIGHT - 30);
  const dx = useRef(2);
  const dy = useRef(-2);
  const paddleX = useRef((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
  const rightPressed = useRef(false);
  const leftPressed = useRef(false);
  const bricks = useRef<Brick[][]>([]);
  const animationRef = useRef<number>();

  const initBricks = () => {
    const newBricks: Brick[][] = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      newBricks[c] = [];
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        newBricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    bricks.current = newBricks;
  };

  const resetGame = () => {
    x.current = CANVAS_WIDTH / 2;
    y.current = CANVAS_HEIGHT - 30;
    dx.current = 2;
    dy.current = -2;
    paddleX.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    setScore(0);
    setGameOver(false);
    setWon(false);
    initBricks();
    setIsPlaying(true);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Bricks
    let activeBricks = 0;
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        if (bricks.current[c][r].status === 1) {
          const brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
          const brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
          bricks.current[c][r].x = brickX;
          bricks.current[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
          ctx.fillStyle = `hsl(${c * 45}, 70%, 60%)`;
          ctx.fill();
          ctx.closePath();
          activeBricks++;

          // Collision Detection
          if (
            x.current > brickX && 
            x.current < brickX + BRICK_WIDTH && 
            y.current > brickY && 
            y.current < brickY + BRICK_HEIGHT
          ) {
            dy.current = -dy.current;
            bricks.current[c][r].status = 0;
            setScore(s => s + 1);
          }
        }
      }
    }

    if (activeBricks === 0 && isPlaying) {
      setWon(true);
      setIsPlaying(false);
      return;
    }

    // Draw Ball
    ctx.beginPath();
    ctx.arc(x.current, y.current, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    // Draw Paddle
    ctx.beginPath();
    ctx.rect(paddleX.current, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    // Movement
    if (x.current + dx.current > CANVAS_WIDTH - BALL_RADIUS || x.current + dx.current < BALL_RADIUS) {
      dx.current = -dx.current;
    }
    if (y.current + dy.current < BALL_RADIUS) {
      dy.current = -dy.current;
    } else if (y.current + dy.current > CANVAS_HEIGHT - BALL_RADIUS) {
      if (x.current > paddleX.current && x.current < paddleX.current + PADDLE_WIDTH) {
        dy.current = -dy.current;
        // Speed up slightly on paddle hit
        dx.current = dx.current * 1.05;
        dy.current = dy.current * 1.05;
      } else {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }
    }

    if (rightPressed.current && paddleX.current < CANVAS_WIDTH - PADDLE_WIDTH) {
      paddleX.current += 7;
    } else if (leftPressed.current && paddleX.current > 0) {
      paddleX.current -= 7;
    }

    x.current += dx.current;
    y.current += dy.current;

    animationRef.current = requestAnimationFrame(draw);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isPlaying, draw]);

  // Controls
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed.current = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed.current = true;
    };
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed.current = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed.current = false;
    };
    
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  // Initial Draw
  useEffect(() => {
    initBricks();
    // Draw initial state once
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && !isPlaying) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.font = "20px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText("Press Start to Play", 160, 160);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[480px] items-center">
        <div className="text-2xl font-bold">Score: {score}</div>
        {!isPlaying && (
          <Button onClick={resetGame}>
            {gameOver || won ? <RotateCcw className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {gameOver || won ? "Try Again" : "Start Game"}
          </Button>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-muted bg-slate-900">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          className="block"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-3xl font-bold">GAME OVER</div>
          </div>
        )}
        {won && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-green-400 text-3xl font-bold">YOU WON!</div>
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground">Use Left/Right Arrows to move paddle</div>
    </div>
  );
}
