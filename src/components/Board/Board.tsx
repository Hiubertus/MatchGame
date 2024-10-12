import React from "react";
import "./Board.scss";
import {BoardProps} from "../Game";

export const Board: React.FC<BoardProps> = ({
                                                tiles,
                                                tileCount,
                                                useFlipAnimation,
                                                handleTileClick,
                                                endGame,
                                                currentGameStats,
                                                contentType
                                            }) => {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="game-board">
            <div className="game-controls">
                <button onClick={endGame} className="end-game-button">
                    Return to Main Menu
                </button>
                <div className="game-stats">
                    <div className="stat-item">
                        <span className="stat-label">Time:</span>
                        <span className="stat-value">{formatTime(currentGameStats.timeSpent)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Flips:</span>
                        <span className="stat-value">{currentGameStats.flippedTiles}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Matches:</span>
                        <span className="stat-value">{currentGameStats.successfulMatches}</span>
                    </div>
                </div>
            </div>
            <div className={`memory-game memory-game--${tileCount}`}>
                {tiles.map((tile, index) => (
                    <div
                        key={tile.id}
                        className={`memory-game__tile 
                            ${(tile.isRevealed || tile.isMatched) ? 'memory-game__tile--revealed' : ''} 
                            ${contentType === 'colors' ? `memory-game__tile--${tile.content}` : ''}
                            ${useFlipAnimation ? 'memory-game__tile--flip' : 'memory-game__tile--fade'}`}
                        onClick={() => handleTileClick(index)}
                    >
                        <div className="memory-game__tile-inner">
                            <div className="memory-game__tile-front"></div>
                            <div className="memory-game__tile-back">
                                {contentType === 'emojis' && tile.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};