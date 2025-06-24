import React from 'react';
import Typingarea from '../component/Typingarea';
import { useNavigate } from 'react-router-dom';

export default function Typingtest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-0 left-0 mt-4 ml-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        Back to Home
      </button>

      {/* Pass solo=true to enable solo typing mode */}
      <Typingarea solo={true} />
    </div>
  );
}
