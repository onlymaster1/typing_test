import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Typingtest from './pages/Typingtest';
import CreateRoom from './pages/createRoom';
import Join from './pages/Join';
import Room from './pages/Room'; // <-- Import Room component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/typingtest" element={<Typingtest />} />
        <Route path="/createRoom" element={<CreateRoom />} />
        <Route path="/join" element={<Join />} />
        <Route path="/room/:roomId" element={<Room />} /> {/* <-- Dynamic room route */}
      </Routes>
    </Router>
  );
}

export default App;
