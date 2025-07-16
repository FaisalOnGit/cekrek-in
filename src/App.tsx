import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HowToPage from './pages/HowToPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-to" element={<HowToPage />} />
    </Routes>
  );
}

export default App;