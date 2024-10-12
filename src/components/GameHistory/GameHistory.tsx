import React from 'react';
import { useGameStore } from '../../lib/store/GameStore';
import './GameHistory.scss';

export const GameHistory: React.FC = () => {
    const { gameHistory, resetGameStore} = useGameStore();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all game data? This action cannot be undone.')) {
            resetGameStore();
            alert('Game data has been reset.');
        }
    };

    return (
        <div className="game-history">
            <div className="table-container">
                {gameHistory.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Mode</th>
                            <th>Tiles</th>
                            <th>Animation</th>
                            <th>Content</th>
                            <th>Hidden</th>
                            <th>Matches</th>
                            <th>Time</th>
                            <th>Flips</th>
                        </tr>
                        </thead>
                        <tbody>
                        {gameHistory.map((game, index) => (
                            <tr key={index}>
                                <td>{formatDate(game.date)}</td>
                                <td>{game.gameMode}</td>
                                <td>{game.tileCount}</td>
                                <td>{game.animationType}</td>
                                <td>{game.contentType}</td>
                                <td>{game.initiallyHidden ? 'Yes' : 'No'}</td>
                                <td>{game.matchesMade}</td>
                                <td>{formatTime(game.timeSpent)}</td>
                                <td>{game.totalFlips}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="placeholder">
                        <p>No game history available. Start playing to see your results!</p>
                    </div>
                )}
            </div>
            {gameHistory.length > 0 ? (<button
                onClick={handleReset}
                className={"reset-button"}
            >
                Reset Game Data
            </button>) : <></>}

        </div>

    );
};