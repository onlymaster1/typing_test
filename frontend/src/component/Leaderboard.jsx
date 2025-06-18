import React from 'react';

export default function Leaderboard({ players }) {
  return (
    <div className="mt-10 bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-green-400 mb-4">Leaderboard</h3>
      <ul className="space-y-2">
        {[...players]
          .sort((a, b) => (b.wpm || 0) - (a.wpm || 0))
          .map((player, index) => (
            <li key={index} className="flex justify-between bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold">{player.name}</span>
              <span>{player.wpm || 0} WPM</span>
              <span>{player.accuracy || 0}%</span>
            </li>
        ))}
      </ul>
    </div>
  );
}
