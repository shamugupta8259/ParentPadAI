import { Layout, AdPlaceholder } from "@/components/layout/MainLayout";
import { getItemById } from "@/data/content";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Maximize2 } from "lucide-react";

// Game Imports
import { TicTacToe, RockPaperScissors } from "@/components/games/SimpleGames";
import { Snake } from "@/components/games/Snake";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { Game2048 } from "@/components/games/2048";
import { Breakout } from "@/components/games/Breakout";
import { FlappyBird } from "@/components/games/FlappyBird";

// Registry of components
const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  "tic-tac-toe": TicTacToe,
  "rock-paper-scissors": RockPaperScissors,
  "snake": Snake,
  "memory-match": MemoryMatch,
  "2048": Game2048,
  "breakout": Breakout,
  "flappy-bird": FlappyBird,
  // Fallback for unimplemented games
  "default": () => (
    <div className="text-center py-20 bg-muted rounded-xl">
      <p className="text-lg font-medium mb-4">Coming Soon!</p>
      <p className="text-muted-foreground">We are polishing this game. Check back later.</p>
    </div>
  )
};

export default function SingleGame() {
  const { id } = useParams();
  const game = getItemById(id || "");
  
  if (!game) {
    return (
      <Layout>
        <div className="container py-20 text-center">Game not found</div>
      </Layout>
    );
  }

  const GameComponent = GAME_COMPONENTS[game.id] || GAME_COMPONENTS["default"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/games">
          <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
          </Button>
        </Link>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              {game.title}
            </h1>
            <p className="text-muted-foreground">{game.description}</p>
          </div>
        </div>

        {/* Game Container */}
        <div className="bg-card border rounded-xl overflow-hidden shadow-lg relative">
          <div className="bg-muted/30 p-2 flex justify-end border-b">
            <Button variant="ghost" size="icon" title="Fullscreen (Coming Soon)">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-8 min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <GameComponent />
          </div>
        </div>

        {/* Ad Space */}
        <AdPlaceholder className="my-8 h-[90px]" label="Game Ad" />

        {/* Instructions */}
        <div className="prose dark:prose-invert max-w-none">
          <h2>How to Play</h2>
          <p>
            Enjoy this free version of {game.title}. Use your mouse or touch screen to interact with the game elements.
            The goal is to {game.description.toLowerCase()}.
          </p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Mouse/Touch:</strong> Interact with buttons and game pieces.</li>
            <li><strong>Keyboard:</strong> Some games support arrow keys or spacebar.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
