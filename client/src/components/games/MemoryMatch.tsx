import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const ICONS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

type Card = {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const duplicated = [...ICONS, ...ICONS];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsLocked(false);
  };

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    if (cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);
      checkForMatch(newFlipped, newCards);
    }
  };

  const checkForMatch = (flipped: number[], currentCards: Card[]) => {
    const [first, second] = flipped;
    
    if (currentCards[first].icon === currentCards[second].icon) {
      setTimeout(() => {
        const matchedCards = [...currentCards];
        matchedCards[first].isMatched = true;
        matchedCards[second].isMatched = true;
        setCards(matchedCards);
        setFlippedCards([]);
        setIsLocked(false);
      }, 500);
    } else {
      setTimeout(() => {
        const resetCards = [...currentCards];
        resetCards[first].isFlipped = false;
        resetCards[second].isFlipped = false;
        setCards(resetCards);
        setFlippedCards([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-md items-center">
        <div className="text-xl font-bold">Moves: {moves}</div>
        <Button onClick={resetGame} variant="outline" size="sm">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 transform perspective-1000
              ${card.isFlipped || card.isMatched 
                ? "bg-white border-2 border-primary rotate-y-180 shadow-md" 
                : "bg-primary text-transparent hover:bg-primary/90 shadow-sm"
              }
            `}
          >
            {(card.isFlipped || card.isMatched) ? card.icon : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}
