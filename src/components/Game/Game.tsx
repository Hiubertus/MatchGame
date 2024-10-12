import React from 'react';
import { GameOptions } from '../GameOptions';
import { Board } from '../Board';
import './Game.scss';
import {useOptionsStore} from "../../lib/store/GameOptionsStore.ts";

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
        startGame
    } = useOptionsStore();

    return (
        <div className="game-container">
            {!isGameStarted ? (
                <GameOptions
                    gameMode={gameMode}
                    tileCount={tileCount}
                    useFlipAnimation={useFlipAnimation}
                    showInitialReveal={showInitialReveal}
                    setGameMode={setGameMode}
                    setTileCount={setTileCount}
                    setAnimationType={setAnimationType}
                    setShowInitialReveal={setShowInitialReveal}
                    startGame={startGame}
                />
            ) : (
                <Board
                    gameMode={gameMode}
                    tileCount={tileCount}
                    useFlipAnimation={useFlipAnimation}
                    showInitialReveal={showInitialReveal}
                />
            )}
        </div>
    );
};
