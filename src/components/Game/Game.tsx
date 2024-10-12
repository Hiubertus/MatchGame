import React from 'react';
import { GameOptions } from '../GameOptions';
import { Board } from '../Board';
import './Game.scss';
import { useGameStore } from "../../lib/store/GameStore";
import { GameMode, TileCount, AnimationType } from "../../lib/store/GameStore";
// import {GameHistory} from "../GameHistory";

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
    currentGameStats: {
        timeSpent: number;
        flippedTiles: number;
        successfulMatches: number;
    };
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
        currentGameStats,
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
        endGame,
        currentGameStats,
    };

    return (
        <div className="game-container">
            {!isGameStarted ? (
                <>
                    <GameOptions {...gameOptionsProps} />
                    {/*<GameHistory/>*/}
                </>
            ) : (
                <Board {...boardProps} />
            )}
        </div>
    );
};