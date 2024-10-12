import React from 'react';
import {AnimationType, GameMode, TileCount} from "../../lib/store/GameOptionsStore.ts";
import "./GameOptions.scss"


interface OptionsProps {
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

export const GameOptions: React.FC<OptionsProps> = ({
                                                            gameMode,
                                                            tileCount,
                                                            useFlipAnimation,
                                                            showInitialReveal,
                                                            setGameMode,
                                                            setTileCount,
                                                            setAnimationType,
                                                            setShowInitialReveal,
                                                            startGame
                                                        }) => {
    return (
        <div className="game-options">
            <div>
                <button
                    onClick={() => setGameMode('pair')}
                    className={gameMode === 'pair' ? 'active' : ''}
                >
                    Match Pairs
                </button>
                <button
                    onClick={() => setGameMode('triplet')}
                    className={gameMode === 'triplet' ? 'active' : ''}
                >
                    Match Triplets
                </button>
            </div>
            <div>
                {[12, 18, 24, 30, 36].map(count => (
                    <button
                        key={count}
                        onClick={() => setTileCount(count as TileCount)}
                        className={tileCount === count ? 'active' : ''}
                    >
                        {count} tiles
                    </button>
                ))}
            </div>
            <div>
                <button
                    onClick={() => setAnimationType('flip')}
                    className={useFlipAnimation ? 'active' : ''}
                >
                    Flip Animation
                </button>
                <button
                    onClick={() => setAnimationType('fade')}
                    className={!useFlipAnimation ? 'active' : ''}
                >
                    Fade Animation
                </button>
            </div>
            <div>
                <button
                    onClick={() => setShowInitialReveal(true)}
                    className={showInitialReveal ? 'active' : ''}
                >
                    Show tiles initially
                </button>
                <button
                    onClick={() => setShowInitialReveal(false)}
                    className={!showInitialReveal ? 'active' : ''}
                >
                    Start with hidden tiles
                </button>
            </div>
            <button onClick={startGame} className="start-game-button">
                Start Game
            </button>
        </div>
    );
};