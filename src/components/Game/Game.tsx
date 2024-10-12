import React, {useEffect} from 'react';
import { GameOptions } from '../GameOptions';
import { Board } from '../Board';
import './Game.scss';
import { useGameStore } from "../../lib/store/GameStore";
import { GameMode, TileCount, AnimationType } from "../../lib/store/GameStore";

export interface GameOptionsProps {
    gameMode: GameMode;
    tileCount: TileCount;
    useFlipAnimation: boolean;
    showInitialReveal: boolean;
    setGameMode: (mode: GameMode) => void;
    setTileCount: (count: TileCount) => void;
    setAnimationType: (type: AnimationType) => void;
    setShowInitialReveal: (show: boolean) => void;
    startGame: () => void;
}

export interface BoardProps {
    tiles: Array<{
        id: number;
        color: string;
        isRevealed: boolean;
        isMatched: boolean;
    }>;
    tileCount: TileCount;
    useFlipAnimation: boolean;
    handleTileClick: (index: number) => void;
    endGame: () => void;
}

export const Game: React.FC = () => {
    const {
        gameMode,
        tileCount,
        useFlipAnimation,
        isGameStarted,
        showInitialReveal,
        setGameMode,
        setTileCount,
        setAnimationType,
        setShowInitialReveal,
        startGame,
        tiles,
        handleTileClick,
        endGame,
        initializeGame
    } = useGameStore();

    const gameOptionsProps: GameOptionsProps = {
        gameMode,
        tileCount,
        useFlipAnimation,
        showInitialReveal,
        setGameMode,
        setTileCount,
        setAnimationType,
        setShowInitialReveal,
        startGame,

    };

    const boardProps: BoardProps = {
        tiles,
        tileCount,
        useFlipAnimation,
        handleTileClick,
        endGame
    };

    useEffect(() => {
        // Sprawdź, czy istnieje zapisany stan gry
        const savedState = localStorage.getItem('game-storage');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            if (parsedState.state.isGameStarted) {
                // Jeśli gra była rozpoczęta, zainicjalizuj ją ponownie
                initializeGame();
            }
            // W przeciwnym razie, stan opcji gry zostanie automatycznie załadowany przez Zustand
        }
    }, [initializeGame]);

    return (
        <div className="game-container">
            {!isGameStarted ? (
                <GameOptions {...gameOptionsProps} />
            ) : (
                <Board {...boardProps} />
            )}
        </div>
    );
};