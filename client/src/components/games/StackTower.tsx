import React, { useEffect, useRef, useState } from "react";

interface Block {
  width: number;
  left: number;
  color: string;
}

const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

const StackTower: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    { width: 180, left: 0, color: randomColor() },
  ]);

  const [movingLeft, setMovingLeft] = useState(true);
  const [currentLeft, setCurrentLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const animationRef = useRef<number | null>(null);

  // Move block side to side
  useEffect(() => {
    if (gameOver) return;

    const animate = () => {
      setCurrentLeft((prev) => {
        if (prev >= 120) setMovingLeft(true);
        if (prev <= -120) setMovingLeft(false);
        return prev + (movingLeft ? -2 : 2);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current!);
  }, [movingLeft, gameOver]);

  const dropBlock = () => {
    if (gameOver) return;

    const lastBlock = blocks[blocks.length - 1];
    const diff = currentLeft - lastBlock.left;
    const overlap = lastBlock.width - Math.abs(diff);

    // No overlap => Game over
    if (overlap <= 0) {
      setGameOver(true);
      return;
    }

    const newBlock: Block = {
      width: overlap,
      left: lastBlock.left + diff / 2,
      color: randomColor(),
    };

    setBlocks([...blocks, newBlock]);
    setCurrentLeft(0);
  };

  const restartGame = () => {
    setBlocks([{ width: 180, left: 0, color: randomColor() }]);
    setCurrentLeft(0);
    setGameOver(false);
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Title */}
      <h1 className="absolute top-6 text-3xl font-bold tracking-wide text-white/90">
        Stack Tower
      </h1>

      {/* Tower Container */}
      <div className="w-[300px] h-[500px] bg-gray-900/40 border border-gray-700 rounded-xl shadow-xl overflow-hidden relative">
        {/* Render blocks */}
        {blocks.map((block, i) => (
          <div
            key={i}
            className="absolute h-8 rounded-md transition-all duration-200 shadow-lg"
            style={{
              width: `${block.width}px`,
              left: `calc(50% + ${block.left}px - ${block.width / 2}px)`,
              bottom: `${i * 32}px`,
              backgroundColor: block.color,
            }}
          ></div>
        ))}

        {/* Moving Block */}
        {!gameOver && (
          <div
            className="absolute h-8 rounded-md shadow-xl"
            style={{
              width: `${blocks[blocks.length - 1].width}px`,
              left: `calc(50% + ${currentLeft}px - ${
                blocks[blocks.length - 1].width / 2
              }px)`,
              bottom: `${blocks.length * 32}px`,
              backgroundColor: randomColor(),
            }}
          ></div>
        )}
      </div>

      {/* Drop Button */}
      {!gameOver ? (
        <button
          onClick={dropBlock}
          className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg text-lg font-semibold shadow-xl transition-all"
        >
          DROP
        </button>
      ) : (
        <button
          onClick={restartGame}
          className="mt-8 px-8 py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-lg text-lg font-semibold shadow-xl transition-all"
        >
          RESTART
        </button>
      )}

      {/* Game Over Message */}
      {gameOver && (
        <p className="mt-4 text-2xl font-bold text-red-500 animate-bounce">
          Game Over!
        </p>
      )}
    </div>
  );
};

export default StackTower;
