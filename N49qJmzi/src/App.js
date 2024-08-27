import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from "react-router-dom";
import GameList from "./components/GameList";
import GameDetails from "./components/GameDetails";
import "./styles.css";

function SearchInput({ searchTerm, handleInputChange }) {
  const location = useLocation();
  
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Entrez le nom d'un jeu"
        className="search-input"
      />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/unnamed.png" alt="Logo" className="logo"/>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Recherche de jeux</Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <div className="container">
            <h1>Recherche de jeux Steam</h1>
            <SearchInput searchTerm={searchTerm} handleInputChange={handleInputChange} />
            <GameList searchTerm={searchTerm} />
          </div>
        } />
        <Route path="/game/:id" element={<GameDetails />} />
      </Routes>
    </Router>
  );
}

export default App;