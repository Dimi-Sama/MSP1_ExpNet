import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Assurez-vous de créer un fichier CSS pour styliser cette page

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenue sur l'aide au backlog (Steam)</h1>
      <p className="home-description">
       Utilisez les boutons ci-dessous pour rechercher des jeux ou consulter votre backlog.
      </p>
      <div className="home-buttons">
        <Link to="/search" className="home-button">Recherche de jeux</Link>
        <Link to="/backlog" className="home-button">Mon Backlog</Link>
      </div>
    </div>
  );
};

export default Home;