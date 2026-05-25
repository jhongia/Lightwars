# Lightwars

Lightwars is a Node.js web project built with Express, Mongoose, and EJS templates. It is designed to be launched locally or deployed to a platform like Heroku.

## Contents

- [Project Overview](#project-overview)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Security](#security)
- [Additional Documentation](#additional-documentation)

## Project Overview

This project uses:

- `express` for the server framework
- `mongoose` for MongoDB integration
- `dotenv` for environment configuration
- `views/` for EJS templates
- `public/` for static assets
- `Procfile` for Heroku-compatible deployment

> The current entrypoint is `app.js`.

## Requirements

- Node.js 18+ (recommended)
- npm
- A MongoDB database instance (local or hosted)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root and add your configuration.
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser at `http://localhost:3000`

## Project Structure

- `app.js` — application entrypoint
- `package.json` — dependency and script configuration
- `Procfile` — `npm start` entry for Heroku
- `public/` — CSS and client-side assets
- `views/` — EJS templates for pages and partials
- `.gitignore` — files excluded from version control

## Environment Variables

The app uses environment variables to keep secrets and configuration outside of source control.

Common variables:

- `PORT` — server port (default is `3000`)
- `MONGODB_URI` — MongoDB connection string
- `SESSION_SECRET` — session or authentication secret

Do not commit your `.env` file or any secret values.

## Deployment

The project supports deployment with the provided `Procfile`.

For production deployment, see [SETUP.md](./SETUP.md).

## Security

- Never add API keys, passwords, or database credentials directly into the repository.
- Keep secrets inside `.env`, and exclude `.env` from Git.
- Use placeholder values for documentation and examples.

## Additional Documentation

- [SETUP.md](./SETUP.md) — full launch and deployment instructions
