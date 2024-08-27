import React, { useState, useEffect } from "react";
import GameItem from "./GameItem";

const GameList = ({ searchTerm }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setGames([]);
      return;
    }

    const fetchGames = async () => {
      const corsProxy = "https://api.allorigins.win/raw?url=";
      const searchApi = `${corsProxy}https://steamcommunity.com/actions/SearchApps/${searchTerm}`;

      try {
        const response = await fetch(searchApi, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        const data = await response.json();

        setGames(data.slice(0, 10));
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
      }
    };

    const timeoutId = setTimeout(fetchGames, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <ul id="gameList">
      {games.map((game, index) => (
        <GameItem key={game.appid} game={game} index={index} />
      ))}
    </ul>
  );
};

export default GameList;
