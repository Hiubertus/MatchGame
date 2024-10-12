import React from "react";
import "./Board.scss";
import {BoardProps} from "../Game";

export const Board: React.FC<BoardProps> = ({
                                                tiles,
                                                tileCount,
                                                useFlipAnimation,
                                                handleTileClick,
                                                endGame
                                            }) => {
    return (
        <div className="game-board">
            <div className="game-controls">
                <button onClick={endGame} className="end-game-button">
                    Return to Main Menu
                </button>
            </div>
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
        </div>
    );
};