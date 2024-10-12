import React from 'react';
import { useGameStore } from '../../lib/store/GameStore';
import './GameHistory.scss';

export const GameHistory: React.FC = () => {
    const { gameHistory} = useGameStore();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="game-history">
            <h2>Game History</h2>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Tile Count</th>
                    <th>Animation</th>
                    <th>Initially Hidden</th>
                    <th>Matches Made</th>
                    <th>Time Spent</th>
                    <th>Total Flips</th>
                </tr>
                </thead>
                <tbody>
                {gameHistory.map((game, index) => (
                    <tr key={index}>
                        <td>{formatDate(game.date)}</td>
                        <td>{game.gameMode}</td>
                        <td>{game.tileCount}</td>
                        <td>{game.animationType}</td>
                        <td>{game.initiallyHidden ? 'Yes' : 'No'}</td>
                        <td>{game.matchesMade}</td>
                        <td>{formatTime(game.timeSpent)}</td>
                        <td>{game.totalFlips}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};