import React, { useRef, useState, useEffect } from "react";
import { Layout, AdPlaceholder } from "@/components/layout/MainLayout";
import { getItemById } from "@/data/content";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";

// Game Imports
import { TicTacToe, RockPaperScissors } from "@/components/games/SimpleGames";
import { Snake } from "@/components/games/Snake";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { Game2048 } from "@/components/games/2048";
import { Breakout } from "@/components/games/Breakout";
import { FlappyBird } from "@/components/games/FlappyBird";
import Chess from "@/components/games/Chess";
import StackTower from "@/components/games/StackTower";
import Sudoku from "@/components/games/Sudoku";

// Registry of components
const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  "tic-tac-toe": TicTacToe,
  "rock-paper-scissors": RockPaperScissors,
  snake: Snake,
  "memory-match": MemoryMatch,
  "2048": Game2048,
  breakout: Breakout,
  "flappy-bird": FlappyBird,
  chess: Chess,
  stackTower: StackTower,
  sudoku: Sudoku,
  default: () => (
    <div className="text-center py-20 bg-muted rounded-xl">
      <p className="text-lg font-medium mb-4">Coming Soon!</p>
      <p className="text-muted-foreground">
        We are polishing this game. Check back later.
      </p>
    </div>
  ),
};

export default function SingleGame() {
  const { id } = useParams();
  const game = getItemById(id || "");
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!game) {
    return (
      <Layout>
        <div className="container py-20 text-center">Game not found</div>
      </Layout>
    );
  }

  const GameComponent = GAME_COMPONENTS[game.id] || GAME_COMPONENTS["default"];

  // Fullscreen toggle
  const handleFullscreen = () => {
    const el = gameContainerRef.current;
    if (!el) return;

    const isCurrentlyFullscreen =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement;

    if (!isCurrentlyFullscreen) {
      // Enter fullscreen
      if (el.requestFullscreen) el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) el.requestFullscreen();
      else if ((el as any).msRequestFullscreen) el.requestFullscreen();
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen)
        document.exitFullscreen();
      else if ((document as any).msExitFullscreen) document.exitFullscreen();
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handler = () => {
      const active =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement;

      setIsFullscreen(!!active);
    };

    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    document.addEventListener("msfullscreenchange", handler);

    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
      document.removeEventListener("msfullscreenchange", handler);
    };
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/games">
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            <p className="text-muted-foreground">{game.description}</p>
          </div>
        </div>

        {/* Game Container */}
        <div
          ref={gameContainerRef}
          className="bg-card border rounded-xl overflow-hidden shadow-lg relative"
        >
          <div className="bg-muted/30 p-2 flex justify-end border-b">
            <Button
              variant="ghost"
              size="icon"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              onClick={handleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="p-8 min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <GameComponent />
          </div>
        </div>

        <AdPlaceholder className="my-8 h-[90px]" label="Game Ad" />

        <div className="prose dark:prose-invert max-w-none">
          <h2>How to Play</h2>
          <p>
            Enjoy this free version of {game.title}. Use your mouse or touch
            screen to interact with the game elements. The goal is to{" "}
            {game.description.toLowerCase()}.
          </p>

          <h3>Controls</h3>
          <ul>
            <li>
              <strong>Mouse/Touch:</strong> Interact with buttons and pieces.
            </li>
            <li>
              <strong>Keyboard:</strong> Some games support arrow keys or
              spacebar.
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
