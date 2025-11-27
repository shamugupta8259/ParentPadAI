import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Game constants
  const GRAVITY = 0.6;
  const JUMP = -8; // Slightly stronger jump
  const PIPE_SPEED = 3;
  const PIPE_SPAWN_RATE = 100; // Frames
  const GAP_SIZE = 150;

  // State refs
  const birdY = useRef(200);
  const birdVelocity = useRef(0);
  const pipes = useRef<{x: number, height: number}[]>([]);
  const frameCount = useRef(0);
  const animationRef = useRef<number | null>(null);

  const resetGame = () => {
    birdY.current = 200;
    birdVelocity.current = 0;
    pipes.current = [];
    frameCount.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const jump = () => {
    if (!isPlaying) return;
    birdVelocity.current = JUMP;
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update physics
    birdVelocity.current += GRAVITY;
    birdY.current += birdVelocity.current;

    // Spawn pipes
    if (frameCount.current % PIPE_SPAWN_RATE === 0) {
      pipes.current.push({
        x: canvas.width,
        height: Math.random() * (canvas.height - GAP_SIZE - 100) + 50
      });
    }

    // Move pipes
    pipes.current.forEach(pipe => {
      pipe.x -= PIPE_SPEED;
    });

    // Remove off-screen pipes
    if (pipes.current.length > 0 && pipes.current[0].x < -50) {
      pipes.current.shift();
      setScore(s => s + 1);
    }

    // Collision detection
    const birdRect = { x: 50, y: birdY.current, w: 30, h: 30 };
    
    // Floor/Ceiling collision
    if (birdY.current > canvas.height - 30 || birdY.current < 0) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    // Pipe collision
    pipes.current.forEach(pipe => {
      // Top pipe
      if (
        birdRect.x < pipe.x + 50 &&
        birdRect.x + birdRect.w > pipe.x &&
        birdRect.y < pipe.height
      ) {
        setGameOver(true);
        setIsPlaying(false);
      }
      // Bottom pipe
      if (
        birdRect.x < pipe.x + 50 &&
        birdRect.x + birdRect.w > pipe.x &&
        birdRect.y + birdRect.h > pipe.height + GAP_SIZE
      ) {
        setGameOver(true);
        setIsPlaying(false);
      }
    });

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bird
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(birdRect.x + 15, birdRect.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(birdRect.x + 22, birdRect.y + 10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw Pipes
    ctx.fillStyle = "#2ecc71";
    pipes.current.forEach(pipe => {
      // Top
      ctx.fillRect(pipe.x, 0, 50, pipe.height);
      // Bottom
      ctx.fillRect(pipe.x, pipe.height + GAP_SIZE, 50, canvas.height - (pipe.height + GAP_SIZE));
    });

    frameCount.current++;
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameLoop]);

  // Click handler
  const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isPlaying) {
      jump();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] items-center">
        <div className="text-2xl font-bold">Score: {score}</div>
        {!isPlaying && (
          <Button onClick={resetGame}>
            {gameOver ? <RotateCcw className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {gameOver ? "Try Again" : "Start Game"}
          </Button>
        )}
      </div>

      <div 
        className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-muted bg-sky-300 cursor-pointer touch-none"
        onMouseDown={handleCanvasClick}
        onTouchStart={handleCanvasClick}
      >
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={500} 
          className="block"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <div className="text-white text-3xl font-bold">GAME OVER</div>
          </div>
        )}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white text-xl font-bold bg-black/20 px-4 py-2 rounded">Click or Tap to Jump</div>
          </div>
        )}
      </div>
    </div>
  );
}
