import React from "react";
import { Link } from "react-router-dom";

const GameItem = ({ game, index }) => {
  return (
    <li
      className="game-item show"
      style={{
        transitionDelay: `${index * 30}ms`,
        opacity: 1,
        transform: "translateY(0)",
      }}
    >
      <Link to={`/game/${game.appid}`}>
        <img
          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_sm_120.jpg`}
          alt={game.name}
          className="game-image"
        />
        <span>
          {game.name} ({game.appid})
        </span>
      </Link>
    </li>
  );
};

export default GameItem;