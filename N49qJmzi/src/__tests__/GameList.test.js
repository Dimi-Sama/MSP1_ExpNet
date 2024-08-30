// src/components/__tests__/GameList.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import GameList from '../GameList';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ appid: '123', name: 'Test Game' }]),
  })
);

test('renders game list with fetched games', async () => {
  render(
    <Router>
      <GameList searchTerm="test" />
    </Router>
  );
  
  await waitFor(() => {
    const gameElement = screen.getByText(/Test Game/i);
    expect(gameElement).toBeInTheDocument();
  });
});