"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Card {
  id: number;
  value: number;
  suit: string;
  faceUp: boolean;
}

const suits = ["♠", "♥", "♦", "♣"];
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const Solitaire: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [piles, setPiles] = useState<Card[][]>([]);
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);

  // Generate full deck
  const generateDeck = () => {
    let id = 1;
    const cards: Card[] = [];

    suits.forEach((s) => {
      values.forEach((v) => {
        cards.push({
          id: id++,
          value: v,
          suit: s,
          faceUp: false,
        });
      });
    });

    return cards.sort(() => Math.random() - 0.5);
  };

  // Deal cards into 7 tableau piles (Solitaire rules)
  const dealCards = (cards: Card[]) => {
    const pilesArr: Card[][] = Array.from({ length: 7 }, () => []);

    let index = 0;
    for (let pile = 0; pile < 7; pile++) {
      for (let i = 0; i <= pile; i++) {
        const card = cards[index++];
        pilesArr[pile].push({
          ...card,
          faceUp: i === pile, // last card face up
        });
      }
    }

    setPiles(pilesArr);
    setStock(cards.slice(index)); // remaining go to stock
  };

  useEffect(() => {
    const newDeck = generateDeck();
    setDeck(newDeck);
    dealCards(newDeck);
  }, []);

  // Shift card from stock → waste
  const drawCard = () => {
    if (stock.length === 0) {
      // reset waste back to stock
      setStock(waste.map((c) => ({ ...c, faceUp: false })));
      setWaste([]);
      return;
    }
    const newCard = stock[0];
    setStock(stock.slice(1));
    setWaste([{ ...newCard, faceUp: true }, ...waste]);
  };

  const cardStyle = (c: Card) =>
    c.faceUp
      ? "bg-white text-black border"
      : "bg-gray-800 border border-gray-700";

  return (
    <div className="w-full min-h-screen p-6 bg-green-700 text-white select-none">
      {/* STOCK + WASTE */}
      <div className="flex gap-6 mb-8">
        {/* Stock */}
        <div
          className="w-24 h-32 rounded-xl bg-gray-900 flex items-center justify-center cursor-pointer"
          onClick={drawCard}
        >
          {stock.length === 0 ? (
            <span className="opacity-50">↻</span>
          ) : (
            <span>🂠</span>
          )}
        </div>

        {/* Waste */}
        <div className="w-24 h-32 relative">
          {waste.map((card, i) => (
            <motion.div
              key={card.id}
              className={`absolute top-0 w-24 h-32 rounded-xl flex items-center justify-center text-3xl ${cardStyle(
                card
              )}`}
              initial={{ x: 30 * i, opacity: 0 }}
              animate={{ x: 30 * i, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {card.faceUp ? `${card.value}${card.suit}` : ""}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 7 TABLEAU PILES */}
      <div className="grid grid-cols-7 gap-4">
        {piles.map((pile, pileIndex) => (
          <div key={pileIndex} className="relative w-28 min-h-[400px]">
            {pile.map((card, cardIndex) => (
              <motion.div
                key={card.id}
                className={`absolute w-24 h-32 rounded-xl flex items-center justify-center text-3xl ${cardStyle(
                  card
                )}`}
                style={{ top: `${cardIndex * 30}px` }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {card.faceUp ? `${card.value}${card.suit}` : ""}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Solitaire;
