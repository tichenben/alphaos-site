# AlphaOS

AlphaOS is an open research dashboard for discovering early projects, smart-money movements, and DeFi opportunities.

## Current stage

This repository contains the static validation MVP:

- public opportunity dashboard
- three independent research categories
- portable JSON data layer
- GitHub Pages deployment

All opportunity records are demonstration data and are not financial advice.

## Data model

The frontend reads `data/opportunities.json`. When the project moves to a server, this file can be replaced by an API without rebuilding the interface.

## Local preview

Serve the repository with any static web server, then open `index.html`.

## Deployment

Pushes to `main` are automatically deployed to GitHub Pages by the workflow in `.github/workflows/pages.yml`.
