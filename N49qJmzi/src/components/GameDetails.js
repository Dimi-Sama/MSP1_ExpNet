import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import "./GameDetails.css";

const GameDetails = () => {
  const [gameData, setGameData] = useState(null);
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [estimatedDownloadTime, setEstimatedDownloadTime] = useState(null);
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [error, setError] = useState(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5030/api/game/${id}`);
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du jeu:", error);
      }
    };
    fetchGameData();
  }, [id]);

  const mediaItems = useMemo(() => {
    return gameData ? [gameData.video, ...gameData.screenshots] : [];
  }, [gameData]);

  const nextMedia = useCallback(() => {
    if (selectedIndex === 0 && !isVideoEnded) {
      return;
    }
    setIsFading(true);
    setTimeout(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
      setIsFading(false);
    }, 500);
  }, [selectedIndex, isVideoEnded, mediaItems.length]);

  useEffect(() => {
    let interval;
    if (selectedIndex !== 0 || isVideoEnded) {
      interval = setInterval(nextMedia, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedIndex, isVideoEnded, nextMedia]);

  const handleVideoEnd = useCallback(() => {
    setIsVideoEnded(true);
    nextMedia();
  }, [nextMedia]);

  const selectMedia = useCallback((index) => {
    setIsFading(true);
    setTimeout(() => {
      setSelectedIndex(index);
      setIsFading(false);
      if (index === 0) {
        setIsVideoEnded(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }
    }, 500);
  }, []);

  const renderMainMedia = useCallback(() => {
    const item = mediaItems[selectedIndex];
    if (selectedIndex === 0) {
      return (
        <video
          ref={videoRef}
          src={item}
          autoPlay
          muted
          controls
          className={`main-media ${isFading ? 'fading' : ''}`}
          onEnded={handleVideoEnd}
        />
      );
    }
    return <img src={item} alt={`Screenshot ${selectedIndex}`} className={`main-media ${isFading ? 'fading' : ''}`} />;
  }, [mediaItems, selectedIndex, isFading, handleVideoEnd]);

  const performSpeedTest = async () => {
    setIsTestingSpeed(true);
    setError(null);
    setDownloadSpeed(null);
    setEstimatedDownloadTime(null);
    const startTime = new Date().getTime();
    const testFileUrl = 'https://sabnzbd.org/tests/internetspeed/50MB.bin';

    try {
      const response = await fetch(testFileUrl);
      const reader = response.body.getReader();
      let receivedLength = 0;

      while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        receivedLength += value.length;
      }

      const endTime = new Date().getTime();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMBps = receivedLength / durationInSeconds / (1024 * 1024);

      setDownloadSpeed(speedMBps);

      if (gameData) {
        const gameSizeMatch = gameData.game_size.match(/(\d+(\.\d+)?)\s*(GB|MB)/i);
        if (gameSizeMatch) {
          const size = parseFloat(gameSizeMatch[1]);
          const unit = gameSizeMatch[3].toUpperCase();
          let gameSizeInMB = unit === 'GB' ? size * 1024 : size;
          const estimatedTimeInSeconds = gameSizeInMB / speedMBps;
          setEstimatedDownloadTime(estimatedTimeInSeconds);
        } else {
          setError("Impossible de calculer le temps de téléchargement : format de taille de jeu non reconnu");
        }
      }
    } catch (error) {
      console.error("Erreur lors du test de vitesse:", error);
      setError("Une erreur s'est produite lors du test de vitesse. Veuillez réessayer.");
    } finally {
      setIsTestingSpeed(false);
    }
  };

  const formatDownloadTime = (timeInSeconds) => {
    if (timeInSeconds < 60) {
      return `${Math.round(timeInSeconds)} secondes`;
    } else if (timeInSeconds < 3600) {
      return `${Math.round(timeInSeconds / 60)} minutes`;
    } else {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.round((timeInSeconds % 3600) / 60);
      return `${hours} heure${hours > 1 ? 's' : ''} et ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const addToBacklog = () => {
    const backlogItem = {
      id: id,
      name: gameData.title,
      cover: gameData.cover_image
    };
    
    let backlog = localStorage.getItem('backlog');
    if (backlog) {
      backlog = JSON.parse(backlog);
      if (!backlog.some(item => item.id === id)) {
        backlog.push(backlogItem);
      }
    } else {
      backlog = [backlogItem];
    }
    
    localStorage.setItem('backlog', JSON.stringify(backlog));
    alert('Jeu ajouté au backlog !');
  };

  if (!gameData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ color: 'white' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="game-details-container">
      <h1 className="game-title">{gameData.title}</h1>
      <div className="game-content">
        <div className="media-gallery">
          <div className="main-media-container">
            {renderMainMedia()}
          </div>
          <div className="thumbnails">
            {mediaItems.map((item, index) => (
              <div 
                key={index} 
                className={`thumbnail ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => selectMedia(index)}
              >
                {index === 0 ? (
                  <div className={`video-thumbnail ${isVideoEnded ? 'video-ended' : ''}`}>
                    <span className="play-icon">▶</span>
                  </div>
                ) : (
                  <img src={item} alt={`Thumbnail ${index}`} />
                )}
              </div>
            ))}
            
          </div>
          <button onClick={performSpeedTest} disabled={isTestingSpeed} className="speed-test-button">
            {isTestingSpeed ? "Test en cours..." : "Tester la vitesse de téléchargement"}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {downloadSpeed && (
            <p><strong>Vitesse de téléchargement:</strong> {downloadSpeed.toFixed(2)} Mo/s</p>
          )}
          {estimatedDownloadTime && (
            <p><strong>Temps de téléchargement estimé:</strong> {formatDownloadTime(estimatedDownloadTime)}</p>
          )}
          <button onClick={addToBacklog} className="add-to-backlog-button">
            Ajouter au backlog
          </button>
        </div>
        <div className="game-info">
          <img src={gameData.cover_image} alt={`${gameData.title} Cover`} className="game-cover" />
          <p>{gameData.description}</p>
          <p><strong>Prix:</strong> {gameData.price}</p>

          <p><strong>Avis:</strong> {gameData.review}</p>
          <p><strong>Taille du jeu:</strong> {gameData.game_size}</p>
          <p><strong>Configuration minimale:</strong> {gameData.min_requirements}</p>
          <a href={`steam://store/${id}`} className="steam-link-button">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Steam_logo.png/1200px-Steam_logo.png" height="20" alt="Steam logo" style={{ marginRight: '10px', verticalAlign: 'middle', scale: '1.5' }} />
          Voir sur Steam
        </a>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;