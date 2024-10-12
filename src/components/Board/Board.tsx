import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./Board.scss";

const colors = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan',
    'brown', 'gray', 'navy', 'olive', 'teal', 'magenta', 'lime', 'indigo',
    'maroon', 'gold'
] as const;
type Color = typeof colors[number];

interface Tile {
    id: number;
    color: Color;
    isRevealed: boolean;
    isMatched: boolean;
}


interface BoardProps {
    gameMode: 'pair' | 'triplet';
    tileCount: 12 | 18 | 24 | 30 | 36;
    useFlipAnimation: boolean;
    showInitialReveal: boolean;
}

export const Board: React.FC<BoardProps> = ({ gameMode, tileCount, useFlipAnimation, showInitialReveal }) => {
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
    const [isCheckingMatch, setIsCheckingMatch] = useState(false);
    const [initialRevealDone, setInitialRevealDone] = useState(false);

    const gameColors = useMemo(() => {
        const colorCount = gameMode === 'pair' ? tileCount / 2 : tileCount / 3;
        return colors.slice(0, colorCount);
    }, [gameMode, tileCount]);

    const initializeGame = useCallback(() => {
        const repeatedColors = gameMode === 'pair'
            ? [...gameColors, ...gameColors]
            : [...gameColors, ...gameColors, ...gameColors];

        const shuffledColors = repeatedColors
            .sort(() => Math.random() - 0.5)
            .map((color, index) => ({
                id: index,
                color,
                isRevealed: showInitialReveal,
                isMatched: false,
            }));

        setTiles(shuffledColors);
        setRevealedIndices([]);

        if (showInitialReveal) {
            setTimeout(() => {
                setTiles(tiles => tiles.map(tile => ({ ...tile, isRevealed: false })));
                setInitialRevealDone(true);
            }, 3000);
        } else {
            setInitialRevealDone(true);
        }
    }, [gameMode, gameColors, showInitialReveal]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const checkMatch = useCallback((indices: number[]) => {
        const newTiles = [...tiles];
        const colors = indices.map(index => newTiles[index].color);

        if (colors.every(color => color === colors[0])) {
            indices.forEach(index => {
                newTiles[index].isMatched = true;
            });
        } else {
            indices.forEach(index => {
                newTiles[index].isRevealed = false;
            });
        }

        setTiles(newTiles);
        setRevealedIndices([]);
        setIsCheckingMatch(false);
    }, [tiles]);

    const handleTileClick = useCallback((index: number) => {
        if (!initialRevealDone || isCheckingMatch || revealedIndices.includes(index) || tiles[index].isMatched) return;

        const newRevealedIndices = [...revealedIndices, index];
        setRevealedIndices(newRevealedIndices);

        const newTiles = [...tiles];
        newTiles[index].isRevealed = true;
        setTiles(newTiles);

        if (newRevealedIndices.length === (gameMode === 'pair' ? 2 : 3)) {
            setIsCheckingMatch(true);
            setTimeout(() => checkMatch(newRevealedIndices), 1000);
        }
    }, [initialRevealDone, isCheckingMatch, revealedIndices, tiles, gameMode, checkMatch]);

    return (
        <div className={`memory-game memory-game--${tileCount}`}>
            {tiles.map((tile, index) => (
                <div
                    key={tile.id}
                    className={`memory-game__tile 
          ${(tile.isRevealed || tile.isMatched) ? 'memory-game__tile--revealed' : ''} 
          memory-game__tile--${tile.color}
          ${useFlipAnimation ? 'memory-game__tile--flip' : 'memory-game__tile--fade'}`}
                    onClick={() => handleTileClick(index)}
                >
                    <div className="memory-game__tile-inner">
                        <div className="memory-game__tile-front"></div>
                        <div className="memory-game__tile-back"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};