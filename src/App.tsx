import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';
import './App.css';

function App() {
  return (
    <Router basename="/movieExplorer">
      <div className="App">
        <nav className="app-nav">
          <div className="nav-brand">
            <Link to="/">MovieExplorer</Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Gallery</Link>
            <Link to="/search" className="nav-link">Search</Link>
          </div>
        </nav>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<GalleryView />} />
            <Route path="/search" element={<ListView />} />
            <Route path="/details/:type/:id" element={<DetailView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
