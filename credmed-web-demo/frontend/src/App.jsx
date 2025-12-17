import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ValidatePage from './pages/ValidatePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/validate" element={<ValidatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
