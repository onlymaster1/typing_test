import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-12 text-center">Typing King</h1>
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <button
  className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg transition"
  onClick={() =>
    navigate('/typingtest', {
      state: { name: 'Solo Player', roomId: 'solo-room' },
    })
  }
>
  Typing Test
</button>
        <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg transition"
        onClick={() => navigate('/createRoom')}>
          Create Room
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg transition"
        onClick={() => navigate('/join')}>
          Join Room
        </button>
      </div>
    </div>
  );
}
