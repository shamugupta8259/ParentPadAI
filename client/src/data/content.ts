import {
  Gamepad2,
  Wrench,
  Type,
  Code2,
  Image as ImageIcon,
  Calculator,
  Clock,
  Search,
  Scissors,
  Grid3X3,
  Ghost,
  Car,
  CircleDot,
  Layers,
} from "lucide-react";

export type Category =
  | "game"
  | "tool-text"
  | "tool-dev"
  | "tool-image"
  | "tool-calc";

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  icon: any;
  path: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const GAMES: Item[] = [
  {
    id: "2048",
    title: "2048",
    description: "Join the numbers and get to the 2048 tile!",
    category: "game",
    icon: Grid3X3,
    path: "/games/2048",
    isPopular: true,
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird Clone",
    description: "Tap to fly and avoid the pipes.",
    category: "game",
    icon: Ghost,
    path: "/games/flappy-bird",
    isPopular: true,
  },
  {
    id: "snake",
    title: "Snake",
    description: "Eat food, grow longer, don't hit the wall.",
    category: "game",
    icon: Gamepad2,
    path: "/games/snake",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic X and O game against AI.",
    category: "game",
    icon: CircleDot,
    path: "/games/tic-tac-toe",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Test your memory by matching pairs.",
    category: "game",
    icon: Layers,
    path: "/games/memory-match",
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Beat the computer in this classic.",
    category: "game",
    icon: Scissors,
    path: "/games/rock-paper-scissors",
  },
  {
    id: "breakout",
    title: "Breakout",
    description: "Smash all the bricks with the ball.",
    category: "game",
    icon: Grid3X3,
    path: "/games/breakout",
  },
  {
    id: "chrome-dino",
    title: "Dino Run",
    description: "The classic offline runner game.",
    category: "game",
    icon: Ghost, // Placeholder
    path: "/games/chrome-dino",
  },
  {
    id: "car-racing",
    title: "Retro Racing",
    description: "Dodge traffic in this 2D racer.",
    category: "game",
    icon: Car,
    path: "/games/car-racing",
  },
  {
    id: "bubble-shooter",
    title: "Bubble Shooter",
    description: "Match 3 bubbles to pop them.",
    category: "game",
    icon: CircleDot,
    path: "/games/bubble-shooter",
  },
  {
    id: "tetris",
    title: "Tetris",
    description: "Stack blocks and clear lines in this classic puzzle game.",
    category: "game",
    icon: Grid3X3,
    path: "/games/tetris",
    isPopular: true,
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Fill the grid so every row, column, and box contains 1-9.",
    category: "game",
    icon: Grid3X3,
    path: "/games/sudoku",
    isPopular: true,
  },
  {
    id: "chess",
    title: "Chess",
    description: "Play chess against AI or a friend.",
    category: "game",
    icon: Layers,
    path: "/games/chess",
    isPopular: true,
  },
  {
    id: "stackTower",
    title: "StackTower",
    description: "Stack the blocks as high as you can without toppling.",
    category: "game",
    icon: Grid3X3,
    path: "/games/stackTower",
  },
  {
    id: "wordle",
    title: "Wordle",
    description: "Guess the word in 6 tries.",
    category: "game",
    icon: Type,
    path: "/games/wordle",
    isPopular: true,
  },
  {
    id: "tic-tac-toe-2p",
    title: "Tic Tac Toe (2P)",
    description: "Classic X and O game for two players.",
    category: "game",
    icon: CircleDot,
    path: "/games/tic-tac-toe-2p",
  },
  {
    id: "solitaire",
    title: "Solitaire",
    description: "Classic card game.",
    category: "game",
    icon: Layers,
    path: "/games/solitaire",
  },
  {
    id: "connect-four",
    title: "Connect Four",
    description: "Connect four discs in a row to win.",
    category: "game",
    icon: Grid3X3,
    path: "/games/connect-four",
  },
];

export const TOOLS: Item[] = [
  // Text Tools
  {
    id: "word-counter",
    title: "Word Counter",
    description: "Count words, characters, and paragraphs.",
    category: "tool-text",
    icon: Type,
    path: "/tools/word-counter",
    isPopular: true,
  },
  {
    id: "character-counter",
    title: "Character Counter",
    description: "Real-time character frequency analysis.",
    category: "tool-text",
    icon: Type,
    path: "/tools/character-counter",
  },
  {
    id: "case-converter",
    title: "Case Converter",
    description: "UPPERCASE, lowercase, camelCase, and more.",
    category: "tool-text",
    icon: Type,
    path: "/tools/case-converter",
  },
  {
    id: "remove-line-breaks",
    title: "Remove Line Breaks",
    description: "Clean up messy text formatting.",
    category: "tool-text",
    icon: Type,
    path: "/tools/remove-line-breaks",
  },

  // Dev Tools
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Prettify and validate JSON data.",
    category: "tool-dev",
    icon: Code2,
    path: "/tools/json-formatter",
    isPopular: true,
  },
  {
    id: "base64",
    title: "Base64 Encoder",
    description: "Encode and decode Base64 strings.",
    category: "tool-dev",
    icon: Code2,
    path: "/tools/base64",
  },
  {
    id: "url-encoder",
    title: "URL Encoder",
    description: "Escape special characters in URLs.",
    category: "tool-dev",
    icon: Code2,
    path: "/tools/url-encoder",
  },
  {
    id: "uuid-generator",
    title: "UUID Generator",
    description: "Generate random UUIDs (v4).",
    category: "tool-dev",
    icon: Code2,
    path: "/tools/uuid-generator",
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Read the payload of JSON Web Tokens.",
    category: "tool-dev",
    icon: Code2,
    path: "/tools/jwt-decoder",
  },
  {
    id: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions against text.",
    category: "tool-dev",
    icon: Code2,
    path: "/tools/regex-tester",
  },

  // Image Tools
  {
    id: "png-jpg",
    title: "PNG to JPG",
    description: "Convert image formats instantly.",
    category: "tool-image",
    icon: ImageIcon,
    path: "/tools/png-jpg",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize images to specific dimensions.",
    category: "tool-image",
    icon: ImageIcon,
    path: "/tools/image-resizer",
  },
  {
    id: "image-compressor",
    title: "Image Compressor",
    description: "Reduce image file size.",
    category: "tool-image",
    icon: ImageIcon,
    path: "/tools/image-compressor",
  },

  // Calc Tools
  {
    id: "age-calculator",
    title: "Age Calculator",
    description: "Calculate exact age from birthdate.",
    category: "tool-calc",
    icon: Calculator,
    path: "/tools/age-calculator",
  },
  {
    id: "percentage-calculator",
    title: "Percentage Calculator",
    description: "Simple percentage calculations.",
    category: "tool-calc",
    icon: Calculator,
    path: "/tools/percentage-calculator",
  },
];

export const ALL_ITEMS = [...GAMES, ...TOOLS];

export function getItemById(id: string) {
  return ALL_ITEMS.find((item) => item.id === id);
}

export function getRelatedItems(
  currentId: string,
  category: Category,
  limit = 3
) {
  return ALL_ITEMS.filter(
    (item) => item.category === category && item.id !== currentId
  ).slice(0, limit);
}
