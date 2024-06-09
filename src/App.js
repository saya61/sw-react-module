import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplatCanvas from './components/SplatCanvas';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/splat" element={<SplatCanvas />} />
            </Routes>
        </Router>
    );
}

export default App;
