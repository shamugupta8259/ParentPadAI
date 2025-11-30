"use client";
import React, { useEffect, useState } from "react";

type Color = "w" | "b";
type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";
type Piece = { type: PieceType; color: Color; hasMoved?: boolean; id?: string };

type Square = Piece | null;

type Board = Square[][];

type Move = {
  from: [number, number];
  to: [number, number];
  piece: Piece;
  captured?: Piece | null;
  promotion?: PieceType | null;
  isEnPassant?: boolean;
  isCastle?: "K" | "Q" | null;
  prevEnPassant?: [number, number] | null;
  prevHalfmoves?: number;
  prevCastlingRights?: CastlingRights;
};

type CastlingRights = {
  wK: boolean;
  wQ: boolean;
  bK: boolean;
  bQ: boolean;
};

const initialCastlingRights: CastlingRights = {
  wK: true,
  wQ: true,
  bK: true,
  bQ: true,
};

const pieceSymbols: Record<Color, Record<PieceType, string>> = {
  w: { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙" },
  b: { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" },
};

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((c) => (c ? { ...c } : null)));
}

function inBounds(x: number, y: number) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

// Initial standard chess setup
function createInitialBoard(): Board {
  const emptyRow: Square[] = Array(8).fill(null);
  const board: Board = [];
  // row 0 - black major
  board.push([
    { type: "R", color: "b" },
    { type: "N", color: "b" },
    { type: "B", color: "b" },
    { type: "Q", color: "b" },
    { type: "K", color: "b" },
    { type: "B", color: "b" },
    { type: "N", color: "b" },
    { type: "R", color: "b" },
  ]);
  // row 1 - black pawns
  board.push(Array.from({ length: 8 }, () => ({ type: "P", color: "b" })));
  // rows 2-5 empty
  for (let i = 0; i < 4; i++) board.push([...emptyRow]);
  // row 6 - white pawns
  board.push(Array.from({ length: 8 }, () => ({ type: "P", color: "w" })));
  // row 7 - white major
  board.push([
    { type: "R", color: "w" },
    { type: "N", color: "w" },
    { type: "B", color: "w" },
    { type: "Q", color: "w" },
    { type: "K", color: "w" },
    { type: "B", color: "w" },
    { type: "N", color: "w" },
    { type: "R", color: "w" },
  ]);
  return board;
}

function findKing(board: Board, color: Color): [number, number] | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "K" && p.color === color) return [r, c];
    }
  }
  return null;
}

// Check if square (r,c) is attacked by the given color
function isSquareAttacked(
  board: Board,
  r: number,
  c: number,
  byColor: Color,
  enPassantTarget: [number, number] | null
): boolean {
  // Pawns
  const pawnDir = byColor === "w" ? -1 : 1;
  for (const dc of [-1, 1]) {
    const rr = r + pawnDir;
    const cc = c + dc;
    if (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p && p.color === byColor && p.type === "P") return true;
    }
  }

  // Knights
  const knightMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];
  for (const [dr, dc] of knightMoves) {
    const rr = r + dr,
      cc = c + dc;
    if (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p && p.color === byColor && p.type === "N") return true;
    }
  }

  // Sliding pieces: rook/queen (orthogonal), bishop/queen (diagonal)
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // orthogonal
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1], // diagonal
  ];
  for (const [dr, dc] of directions) {
    let rr = r + dr,
      cc = c + dc;
    while (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p) {
        if (p.color === byColor) {
          if (Math.abs(dr) === Math.abs(dc)) {
            if (p.type === "B" || p.type === "Q") return true;
          } else {
            if (p.type === "R" || p.type === "Q") return true;
          }
        }
        break; // blocked
      }
      rr += dr;
      cc += dc;
    }
  }

  // King adjacent squares
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = r + dr,
        cc = c + dc;
      if (inBounds(rr, cc)) {
        const p = board[rr][cc];
        if (p && p.color === byColor && p.type === "K") return true;
      }
    }
  }

  // En passant attack: pawns attacking the square where an en-passant capture would land
  if (enPassantTarget) {
    const [er, ec] = enPassantTarget;
    // An en-passant target square is the square behind the pawn that moved two.
    // For attack purposes: if enPassantTarget equals (r,c) and there's a pawn that can capture into it, that pawn attacks the target.
    if (er === r && ec === c) {
      // find pawns one rank away diagonally
      const candidateRank = byColor === "w" ? r + 1 : r - 1;
      for (const dc of [-1, 1]) {
        const cc = c + dc;
        if (inBounds(candidateRank, cc)) {
          const p = board[candidateRank][cc];
          if (p && p.color === byColor && p.type === "P") return true;
        }
      }
    }
  }

  return false;
}

// Generate pseudo-legal moves (doesn't account for leaving king in check)
function generatePseudoLegalMoves(
  board: Board,
  color: Color,
  enPassantTarget: [number, number] | null,
  castlingRights: CastlingRights
) {
  const moves: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;

      const addMove = (toR: number, toC: number, extra: Partial<Move> = {}) => {
        const target = board[toR][toC];
        moves.push({
          from: [r, c],
          to: [toR, toC],
          piece: { ...p },
          captured: target ? { ...target } : null,
          isEnPassant: false,
          isCastle: null,
          prevEnPassant: enPassantTarget,
          prevHalfmoves: 0,
          prevCastlingRights: { ...castlingRights },
          ...extra,
        });
      };

      if (p.type === "P") {
        const dir = p.color === "w" ? -1 : 1;
        const startRow = p.color === "w" ? 6 : 1;

        // forward one
        const fr = r + dir;
        if (inBounds(fr, c) && !board[fr][c]) addMove(fr, c);

        // forward two from start
        const fr2 = r + dir * 2;
        if (
          r === startRow &&
          inBounds(fr2, c) &&
          !board[fr][c] &&
          !board[fr2][c]
        ) {
          addMove(fr2, c, { prevEnPassant: enPassantTarget }); // double push (we will set enPassant outside)
        }

        // captures
        for (const dc of [-1, 1]) {
          const cc = c + dc;
          const rr = r + dir;
          if (inBounds(rr, cc)) {
            const target = board[rr][cc];
            if (target && target.color !== p.color) addMove(rr, cc);
          }
        }

        // en passant capture
        if (enPassantTarget) {
          const [er, ec] = enPassantTarget;
          if (er === r + dir && Math.abs(ec - c) === 1) {
            // capturing the pawn that just double-moved
            addMove(er, ec, { isEnPassant: true });
          }
        }
      } else if (p.type === "N") {
        const knightMoves = [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1],
        ];
        for (const [dr, dc] of knightMoves) {
          const rr = r + dr,
            cc = c + dc;
          if (!inBounds(rr, cc)) continue;
          if (!board[rr][cc] || board[rr][cc]!.color !== color) addMove(rr, cc);
        }
      } else if (p.type === "B" || p.type === "R" || p.type === "Q") {
        const directions: [number, number][] = [];
        if (p.type === "B" || p.type === "Q")
          directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        if (p.type === "R" || p.type === "Q")
          directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
        for (const [dr, dc] of directions) {
          let rr = r + dr,
            cc = c + dc;
          while (inBounds(rr, cc)) {
            if (!board[rr][cc]) {
              addMove(rr, cc);
            } else {
              if (board[rr][cc]!.color !== color) addMove(rr, cc);
              break;
            }
            rr += dr;
            cc += dc;
          }
        }
      } else if (p.type === "K") {
        // normal king moves
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const rr = r + dr,
              cc = c + dc;
            if (!inBounds(rr, cc)) continue;
            if (!board[rr][cc] || board[rr][cc]!.color !== color)
              addMove(rr, cc);
          }
        }

        // castling - simple rules:
        // King and rook haven't moved (castling rights)
        // squares between empty
        // king not in check and doesn't pass through or land on attacked square
        // white: r=7, black r=0
        if (!p.hasMoved) {
          const rank = p.color === "w" ? 7 : 0;
          // king side
          if (
            (p.color === "w" && castlingRights.wK) ||
            (p.color === "b" && castlingRights.bK)
          ) {
            // rook at file 7
            if (board[rank][5] === null && board[rank][6] === null) {
              // check squares not under attack and king not in check
              const kingPos = [r, c];
              const pathOk =
                !isSquareAttacked(
                  board,
                  rank,
                  4,
                  oppositeColor(color),
                  enPassantTarget
                ) &&
                !isSquareAttacked(
                  board,
                  rank,
                  5,
                  oppositeColor(color),
                  enPassantTarget
                ) &&
                !isSquareAttacked(
                  board,
                  rank,
                  6,
                  oppositeColor(color),
                  enPassantTarget
                );
              const rook = board[rank][7];
              if (rook && rook.type === "R" && !rook.hasMoved && pathOk) {
                addMove(rank, 6, { isCastle: "K" });
              }
            }
          }
          // queen side
          if (
            (p.color === "w" && castlingRights.wQ) ||
            (p.color === "b" && castlingRights.bQ)
          ) {
            if (
              board[rank][1] === null &&
              board[rank][2] === null &&
              board[rank][3] === null
            ) {
              const kingPos = [r, c];
              const pathOk =
                !isSquareAttacked(
                  board,
                  rank,
                  4,
                  oppositeColor(color),
                  enPassantTarget
                ) &&
                !isSquareAttacked(
                  board,
                  rank,
                  3,
                  oppositeColor(color),
                  enPassantTarget
                ) &&
                !isSquareAttacked(
                  board,
                  rank,
                  2,
                  oppositeColor(color),
                  enPassantTarget
                );
              const rook = board[rank][0];
              if (rook && rook.type === "R" && !rook.hasMoved && pathOk) {
                addMove(rank, 2, { isCastle: "Q" });
              }
            }
          }
        }
      }
    }
  }

  return moves;
}

function oppositeColor(c: Color): Color {
  return c === "w" ? "b" : "w";
}

// Filter pseudo-legal moves to legal moves that don't leave own king in check
function generateLegalMoves(
  board: Board,
  color: Color,
  enPassantTarget: [number, number] | null,
  castlingRights: CastlingRights
) {
  const pseudo = generatePseudoLegalMoves(
    board,
    color,
    enPassantTarget,
    castlingRights
  );
  const legal: Move[] = [];
  for (const mv of pseudo) {
    const copy = cloneBoard(board);
    const applied = applyMoveOnBoard(
      copy,
      mv,
      enPassantTarget,
      castlingRights,
      true
    );
    // applied returns {board, enPassantTarget, castlingRights}
    const kingPos = findKing(applied.board, color);
    let inCheck = false;
    if (kingPos) {
      inCheck = isSquareAttacked(
        applied.board,
        kingPos[0],
        kingPos[1],
        oppositeColor(color),
        applied.enPassantTarget
      );
    } else {
      // Shouldn't happen, but treat as in check
      inCheck = true;
    }
    if (!inCheck) legal.push(mv);
  }
  return legal;
}

// Apply a move to a board clone and return new board state (helper for legal checking)
function applyMoveOnBoard(
  board: Board,
  mv: Move,
  enPassantTarget: [number, number] | null,
  castlingRights: CastlingRights,
  forSimulation = false
): {
  board: Board;
  enPassantTarget: [number, number] | null;
  castlingRights: CastlingRights;
} {
  const copy = cloneBoard(board);
  const [fr, fc] = mv.from;
  const [tr, tc] = mv.to;
  const moving = copy[fr][fc];
  if (!moving) return { board: copy, enPassantTarget, castlingRights };

  // reset enPassant unless this move sets it
  let newEnPassant: [number, number] | null = null;
  let newCastling = { ...castlingRights };

  // Handle en passant capture
  if (mv.isEnPassant) {
    // moving pawn goes to target square; captured pawn is behind it
    const dir = moving.color === "w" ? 1 : -1;
    const capR = tr + dir;
    copy[capR][tc] = null;
  }

  // Handle castling
  if (mv.isCastle && moving.type === "K") {
    // king moves; rook moves accordingly
    if (mv.isCastle === "K") {
      // king side: rook from file 7 to 5
      const rank = tr;
      copy[tr][tc] = { ...moving, hasMoved: true };
      copy[fr][fc] = null;
      const rook = copy[rank][7];
      copy[rank][7] = null;
      copy[rank][5] = rook ? { ...rook, hasMoved: true } : null;
    } else if (mv.isCastle === "Q") {
      // queen side: rook from file 0 to 3
      const rank = tr;
      copy[tr][tc] = { ...moving, hasMoved: true };
      copy[fr][fc] = null;
      const rook = copy[rank][0];
      copy[rank][0] = null;
      copy[rank][3] = rook ? { ...rook, hasMoved: true } : null;
    }
    // update castling rights
    if (moving.color === "w") newCastling.wK = newCastling.wQ = false;
    else newCastling.bK = newCastling.bQ = false;
    // return
    return { board: copy, enPassantTarget: null, castlingRights: newCastling };
  }

  // Normal capture/move
  const captured = copy[tr][tc];
  copy[tr][tc] = { ...moving, hasMoved: true };
  copy[fr][fc] = null;

  // Pawn double push sets enPassantTarget
  if (moving.type === "P" && Math.abs(tr - fr) === 2) {
    // target is the square behind the pawn (where an en-passant capture would land)
    newEnPassant = [(fr + tr) / 2, fc] as [number, number];
  }

  // Promotion: if provided in mv.promotion (simulation might not set); but for simulated moves we can auto-queen
  if (moving.type === "P") {
    const promotionRank = moving.color === "w" ? 0 : 7;
    if (tr === promotionRank) {
      // If it's simulation and no promotion specified, promote to Queen
      copy[tr][tc] = {
        ...(mv.promotion ? { type: mv.promotion } : ({ type: "Q" } as any)),
        color: moving.color,
        hasMoved: true,
      };
    }
  }

  // If a rook or king moved/was captured update castling rights
  if (moving.type === "K") {
    if (moving.color === "w") newCastling.wK = newCastling.wQ = false;
    else newCastling.bK = newCastling.bQ = false;
  }
  if (moving.type === "R") {
    if (fr === 7 && fc === 0) newCastling.wQ = false;
    if (fr === 7 && fc === 7) newCastling.wK = false;
    if (fr === 0 && fc === 0) newCastling.bQ = false;
    if (fr === 0 && fc === 7) newCastling.bK = false;
  }
  // If a rook was captured, update castling rights for that side
  if (captured && captured.type === "R") {
    if (tr === 7 && tc === 0) newCastling.wQ = false;
    if (tr === 7 && tc === 7) newCastling.wK = false;
    if (tr === 0 && tc === 0) newCastling.bQ = false;
    if (tr === 0 && tc === 7) newCastling.bK = false;
  }

  return {
    board: copy,
    enPassantTarget: newEnPassant,
    castlingRights: newCastling,
  };
}

export default function Chess() {
  // state
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [turn, setTurn] = useState<Color>("w");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [enPassantTarget, setEnPassantTarget] = useState<
    [number, number] | null
  >(null);
  const [castlingRights, setCastlingRights] = useState<CastlingRights>(
    initialCastlingRights
  );
  const [history, setHistory] = useState<Move[]>([]);
  const [boardHistory, setBoardHistory] = useState<
    {
      board: Board;
      enPassant: [number, number] | null;
      castling: CastlingRights;
      turn: Color;
    }[]
  >([]);
  const [promotionModal, setPromotionModal] = useState<{
    pos: [number, number];
    color: Color;
  } | null>(null);
  const [status, setStatus] = useState<string>("");

  // recompute legal moves when board/turn/enPassant/rights changes
  useEffect(() => {
    const moves = generateLegalMoves(
      board,
      turn,
      enPassantTarget,
      castlingRights
    );
    setLegalMoves(moves);

    // check for check/checkmate/stalemate
    const kingPos = findKing(board, turn);
    const inCheck = kingPos
      ? isSquareAttacked(
          board,
          kingPos[0],
          kingPos[1],
          oppositeColor(turn),
          enPassantTarget
        )
      : false;
    if (moves.length === 0) {
      if (inCheck) {
        setStatus(
          `${turn === "w" ? "White" : "Black"} is checkmated — ${
            turn === "w" ? "Black" : "White"
          } wins!`
        );
      } else {
        setStatus("Stalemate — draw");
      }
    } else {
      setStatus(
        inCheck
          ? `${turn === "w" ? "White" : "Black"} is in check`
          : `${turn === "w" ? "White" : "Black"} to move`
      );
    }
  }, [board, turn, enPassantTarget, castlingRights]);

  // helpers to get legal moves from a square
  const legalMovesFrom = (r: number, c: number) =>
    legalMoves.filter((m) => m.from[0] === r && m.from[1] === c);

  const handleSquareClick = (r: number, c: number) => {
    const sq = board[r][c];
    // if selecting own piece
    if (sq && sq.color === turn) {
      setSelected([r, c]);
      return;
    }

    // if a piece is selected and clicking a legal destination, make move
    if (selected) {
      const movesFromSel = legalMovesFrom(selected[0], selected[1]);
      const chosen = movesFromSel.find((m) => m.to[0] === r && m.to[1] === c);
      if (chosen) {
        // If the move is a pawn promotion, open modal to select piece
        const movingPiece = board[chosen.from[0]][chosen.from[1]];
        const promotionRank =
          movingPiece && movingPiece.type === "P"
            ? movingPiece.color === "w"
              ? 0
              : 7
            : -1;
        if (
          movingPiece &&
          movingPiece.type === "P" &&
          chosen.to[0] === promotionRank
        ) {
          // push state and open modal; postpone applying move until promotion selection
          setBoardHistory((prev) => [
            ...prev,
            {
              board: cloneBoard(board),
              enPassant: enPassantTarget,
              castling: { ...castlingRights },
              turn,
            },
          ]);
          setHistory((prev) => [...prev, chosen]);
          setPromotionModal({ pos: chosen.to, color: movingPiece.color });
          // temporarily apply move but promotion will replace the pawn
          const applied = applyMoveOnBoard(
            board,
            chosen,
            enPassantTarget,
            castlingRights
          );
          setBoard(applied.board);
          setEnPassantTarget(applied.enPassantTarget);
          setCastlingRights(applied.castlingRights);
          setSelected(null);
          setTurn(oppositeColor(turn));
          return;
        }

        // normal move
        pushHistoryAndApply(chosen);
        return;
      }
    }

    // otherwise deselect
    setSelected(null);
  };

  const pushHistoryAndApply = (mv: Move) => {
    // save current snapshot for undo
    setBoardHistory((prev) => [
      ...prev,
      {
        board: cloneBoard(board),
        enPassant: enPassantTarget,
        castling: { ...castlingRights },
        turn,
      },
    ]);
    setHistory((prev) => [...prev, mv]);

    // apply on board
    const applied = applyMoveOnBoard(
      board,
      mv,
      enPassantTarget,
      castlingRights
    );
    setBoard(applied.board);
    setEnPassantTarget(applied.enPassantTarget);

    // Update castling rights / rook or king moves captured inside applyMoveOnBoard
    setCastlingRights(applied.castlingRights);

    // Turn switches
    setSelected(null);
    setTurn(oppositeColor(turn));
  };

  // Promotion selection
  const completePromotion = (choice: PieceType) => {
    if (!history.length) return;
    const lastMove = history[history.length - 1];
    // lastMove.to contains promotion square
    const { to } = lastMove;
    const [r, c] = to;
    // replace pawn with chosen piece
    const newBoard = cloneBoard(board);
    newBoard[r][c] = {
      type: choice,
      color: promotionModal!.color,
      hasMoved: true,
    };
    setBoard(newBoard);
    setPromotionModal(null);
    setStatus("");
  };

  // Undo
  const undo = () => {
    const bh = boardHistory.pop();
    if (!bh) return;
    setBoardHistory([...boardHistory]);
    setBoard(bh.board);
    setEnPassantTarget(bh.enPassant);
    setCastlingRights(bh.castling);
    setTurn(bh.turn);
    history.pop();
    setHistory([...history]);
    setSelected(null);
    setStatus("");
  };

  // Reset
  const resetGame = () => {
    setBoard(createInitialBoard());
    setTurn("w");
    setSelected(null);
    setLegalMoves([]);
    setEnPassantTarget(null);
    setCastlingRights(initialCastlingRights);
    setHistory([]);
    setBoardHistory([]);
    setPromotionModal(null);
    setStatus("");
  };

  // Visual helpers
  const isMoveDestination = (r: number, c: number) => {
    return legalMoves.some(
      (m) =>
        m.to[0] === r &&
        m.to[1] === c &&
        selected &&
        m.from[0] === selected[0] &&
        m.from[1] === selected[1]
    );
  };
  const isSelected = (r: number, c: number) =>
    selected && selected[0] === r && selected[1] === c;
  const isInCheck = (color: Color) => {
    const kp = findKing(board, color);
    return kp
      ? isSquareAttacked(
          board,
          kp[0],
          kp[1],
          oppositeColor(color),
          enPassantTarget
        )
      : false;
  };

  // Render square coordinate label (optional)
  const fileLabel = (c: number) => "abcdefgh"[c];
  const rankLabel = (r: number) => 8 - r;

  // compute legal moves for selected square (for highlighting)
  const movesFromSelected = selected
    ? legalMovesFrom(selected[0], selected[1])
    : [];

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-800 via-green-700 to-green-600 p-6 flex flex-col items-center gap-6">
      <div className="w-full max-w-5xl bg-white/5 p-4 rounded-xl shadow-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Chess — Full Rules</h2>
            <div className="text-sm opacity-80">{status}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetGame}
              className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500"
            >
              Reset
            </button>
            <button
              onClick={undo}
              className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500"
            >
              Undo
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Board */}
          <div className="bg-green-900 rounded-lg p-4">
            <div className="grid grid-cols-9 gap-0 select-none">
              {/* top-left corner empty */}
              <div className="w-8 h-8"></div>
              {/* file labels */}
              {Array.from({ length: 8 }).map((_, c) => (
                <div
                  key={`file-${c}`}
                  className="w-12 h-8 flex items-center justify-center text-sm text-white/80"
                >
                  {fileLabel(c)}
                </div>
              ))}

              {board.map((row, r) => (
                <React.Fragment key={`row-${r}`}>
                  {/* rank label */}
                  <div className="w-8 h-12 flex items-center justify-center text-sm text-white/80">
                    {rankLabel(r)}
                  </div>
                  {row.map((sq, c) => {
                    const dark = (r + c) % 2 === 1;
                    const bg = dark ? "bg-green-800" : "bg-green-300/20";
                    const highlight = isMoveDestination(r, c)
                      ? "ring-4 ring-sky-500/60"
                      : isSelected(r, c)
                      ? "ring-4 ring-yellow-400/60"
                      : "";
                    const checkHighlight =
                      isInCheck(board[r][c]?.color || turn) &&
                      board[r][c] &&
                      board[r][c]!.type === "K"
                        ? "ring-4 ring-red-500/70"
                        : "";
                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={() => handleSquareClick(r, c)}
                        className={`w-12 h-12 flex items-center justify-center border border-transparent relative ${bg} ${highlight} ${checkHighlight} cursor-pointer`}
                      >
                        {/* move dots / capture indicator */}
                        {isMoveDestination(r, c) && (
                          <div
                            className={`absolute ${
                              board[r][c]
                                ? "bg-red-500/80 w-10 h-10 rounded-md opacity-90"
                                : "bg-yellow-300/70 w-3 h-3 rounded-full"
                            }`}
                          ></div>
                        )}

                        {/* piece */}
                        {sq && (
                          <div className="z-10 text-2xl select-none pointer-events-none">
                            <span
                              className={
                                sq.color === "w" ? "drop-shadow-lg" : ""
                              }
                            >
                              {pieceSymbols[sq.color][sq.type]}
                            </span>
                          </div>
                        )}
                        {/* highlight selection overlay */}
                        {isSelected(r, c) && (
                          <div className="absolute inset-0 border-2 border-yellow-400/60 rounded"></div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right panel: moves */}
          <div className="flex-1 min-w-[220px]">
            <div className="bg-white/5 p-3 rounded">
              <h3 className="text-white font-semibold mb-2">Move History</h3>
              <div className="max-h-[360px] overflow-auto text-sm text-white/90">
                {history.length === 0 && (
                  <div className="opacity-60">No moves yet</div>
                )}
                <ol className="list-decimal pl-5">
                  {history.map((m, i) => {
                    const piece = m.piece.type;
                    const from = `${fileLabel(m.from[1])}${8 - m.from[0]}`;
                    const to = `${fileLabel(m.to[1])}${8 - m.to[0]}`;
                    let text = `${piece}${from}-${to}`;
                    if (m.promotion) text += `=${m.promotion}`;
                    if (m.isCastle === "K") text = "O-O";
                    if (m.isCastle === "Q") text = "O-O-O";
                    return (
                      <li key={i} className="mb-1">
                        {text}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            <div className="mt-4 bg-white/5 p-3 rounded">
              <div className="mb-2 text-sm text-white/80">Info</div>
              <div className="text-sm text-white/90">
                <div>
                  Turn: <strong>{turn === "w" ? "White" : "Black"}</strong>
                </div>
                <div>
                  Castling: W(K:{castlingRights.wK ? "Y" : "N"}, Q:
                  {castlingRights.wQ ? "Y" : "N"}) • B(K:
                  {castlingRights.bK ? "Y" : "N"}, Q:
                  {castlingRights.bQ ? "Y" : "N"})
                </div>
                <div>
                  En Passant Target:{" "}
                  {enPassantTarget
                    ? `${fileLabel(enPassantTarget[1])}${
                        8 - enPassantTarget[0]
                      }`
                    : "—"}
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => {
                      /* hint: maybe auto-move features */
                    }}
                    className="px-2 py-1 bg-sky-600 rounded mr-2"
                  >
                    Hint
                  </button>
                  <button
                    onClick={() => {
                      /* placeholder */
                    }}
                    className="px-2 py-1 bg-gray-600 rounded"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion modal */}
      {promotionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="bg-white rounded p-4 text-black z-60">
            <h3 className="font-semibold mb-2">Promote pawn</h3>
            <div className="flex gap-2">
              {(["Q", "R", "B", "N"] as PieceType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    completePromotion(t);
                  }}
                  className="px-3 py-2 bg-sky-600 text-white rounded"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
