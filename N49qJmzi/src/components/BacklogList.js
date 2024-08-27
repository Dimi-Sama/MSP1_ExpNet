import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BacklogList = () => {
  const [backlog, setBacklog] = useState([]);

  useEffect(() => {
    const storedBacklog = localStorage.getItem('backlog');
    if (storedBacklog) {
      setBacklog(JSON.parse(storedBacklog));
    }
  }, []);

  const clearBacklog = () => {
    localStorage.removeItem('backlog');
    setBacklog([]);
  };

  const removeFromBacklog = (id) => {
    const updatedBacklog = backlog.filter(game => game.id !== id);
    setBacklog(updatedBacklog);
    localStorage.setItem('backlog', JSON.stringify(updatedBacklog));
  };

  return (
    <div className="backlog-container">
      <h1>Ma liste de backlog</h1>
      {backlog.length === 0 ? (
        <p style={{ color: 'white' }}>Votre backlog est vide.</p>
      ) : (
        <>
          <ul className="backlog-list">
            {backlog.map((game) => (
              <li key={game.id} className="backlog-item">
                <img src={game.cover} alt={game.name} className="backlog-cover" />
                <span className="backlog-name">{game.name}</span>
                <div className="backlog-buttons">
                <Link to={`/game/${game.id}`} className="backlog-link">Voir plus</Link>
                <button onClick={() => removeFromBacklog(game.id)} className="remove-from-backlog-button">
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={clearBacklog} className="clear-backlog-button">Vider le backlog</button>
        </>
      )}
    </div>
  );
};

export default BacklogList;