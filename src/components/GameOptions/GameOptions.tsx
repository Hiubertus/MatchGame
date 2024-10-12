import React from 'react';
import { TileCount } from "../../lib/store/GameStore";
import "./GameOptions.scss"
import {GameOptionsProps} from "../Game";

export const GameOptions: React.FC<GameOptionsProps> = ({
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
                    Pairs
                </button>
                <button
                    onClick={() => setGameMode('triplet')}
                    className={gameMode === 'triplet' ? 'active' : ''}
                >
                    Triplets
                </button>
            </div>
            <div className="tile-count-buttons">
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
                    Flip
                </button>
                <button
                    onClick={() => setAnimationType('fade')}
                    className={!useFlipAnimation ? 'active' : ''}
                >
                    Fade
                </button>
            </div>
            <div>
                <button
                    onClick={() => setShowInitialReveal(true)}
                    className={showInitialReveal ? 'active' : ''}
                >
                    Show Initial
                </button>
                <button
                    onClick={() => setShowInitialReveal(false)}
                    className={!showInitialReveal ? 'active' : ''}
                >
                    Hide Initial
                </button>
            </div>
            <button onClick={startGame} className="start-game-button">
                Start Game
            </button>
        </div>
    );
};