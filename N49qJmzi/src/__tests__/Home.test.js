// src/components/__tests__/Home.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../Home';

test('renders home page with correct title and buttons', () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  
  const titleElement = screen.getByText(/Bienvenue sur l'aide au backlog/i);
  expect(titleElement).toBeInTheDocument();
  
  const searchButton = screen.getByText(/Recherche de jeux/i);
  expect(searchButton).toBeInTheDocument();
  
  const backlogButton = screen.getByText(/Mon Backlog/i);
  expect(backlogButton).toBeInTheDocument();
});