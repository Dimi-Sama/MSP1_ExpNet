import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom"; // Assurez-vous que useLocation est importé
import GameList from "./components/GameList";
import GameDetails from "./components/GameDetails";
import BacklogList from "./components/BacklogList";
import Home from "./components/Home"; // Importer le composant Home
import "./styles.css";

function SearchInput({ searchTerm, handleInputChange }) {
  const location = useLocation(); // Utiliser useLocation
  
  if (location.pathname !== "/search") {
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
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/search">Recherche de jeux</Link>
        </li>
        <li>
          <Link to="/backlog">Mon Backlog</Link>
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
        <Route path="/" element={<Home />} /> {/* Ajouter la route pour Home */}
        <Route path="/search" element={
          <div className="container">
            <h1>Recherche de jeux Steam</h1>
            <SearchInput searchTerm={searchTerm} handleInputChange={handleInputChange} />
            <GameList searchTerm={searchTerm} />
          </div>
        } />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/backlog" element={<BacklogList />} />
      </Routes>
    </Router>
  );
}

export default App;