// src/components/__tests__/GameItem.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import GameItem from '../GameItem';

test('renders game item with correct information', () => {
  const mockGame = { appid: '123', name: 'Test Game' };
  render(
    <Router>
      <GameItem game={mockGame} index={0} />
    </Router>
  );
  
  const gameNameElement = screen.getByText(/Test Game/i);
  expect(gameNameElement).toBeInTheDocument();
  
  const gameImage = screen.getByAltText('Test Game');
  expect(gameImage).toHaveAttribute('src', 'https://cdn.cloudflare.steamstatic.com/steam/apps/123/capsule_sm_120.jpg');
});