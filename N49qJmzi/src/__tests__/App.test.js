// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar with correct links', () => {
  render(<App />);
  
  const homeLink = screen.getByText(/Accueil/i);
  expect(homeLink).toBeInTheDocument();
  
  const searchLink = screen.getByText(/Recherche de jeux/i);
  expect(searchLink).toBeInTheDocument();
  
  const backlogLink = screen.getByText(/Mon Backlog/i);
  expect(backlogLink).toBeInTheDocument();
});