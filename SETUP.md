# Lightwars Setup and Deployment

This document describes how to prepare, run, and deploy the Lightwars project from start to finish.

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB instance (local or hosted)
- Git (optional, for cloning)

## 1. Clone the project

If you have not already cloned the repository:

```bash
git clone <repository-url>
cd Web_Lightwars
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file in the project root.

Example `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lightwars
SESSION_SECRET=your_session_secret_here
```

### Important

- Do not commit `.env` to source control.
- Never store real API keys, passwords, or secrets in repository files.

## 4. Run the app locally

Start the server:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

If you need a different port, set `PORT` in `.env`.

## 5. Understand the code structure

- `app.js`: server entrypoint
- `views/`: EJS pages
- `public/css/`: stylesheets
- `Procfile`: launch command for platforms like Heroku

## 6. Add missing app routes and models

The current `app.js` contains a startup skeleton. If you need to add application logic, consider:

- defining Mongoose models in a `models/` folder
- adding route handlers in `routes/`
- connecting to MongoDB with `mongoose.connect(process.env.MONGODB_URI)`
- using Express middleware for parsing JSON and URL-encoded data

## 7. Deploying to Heroku

The repository already includes a `Procfile` configured for Heroku.

1. Login to Heroku:
   ```bash
   heroku login
   ```
2. Create a Heroku app:
   ```bash
   heroku create
   ```
3. Set environment variables on Heroku:
   ```bash
   heroku config:set MONGODB_URI=<your-mongodb-uri>
   heroku config:set SESSION_SECRET=<your-secret>
   ```
4. Push to Heroku:
   ```bash
   git push heroku main
   ```

## 8. Verify the deployment

After deployment, open the app:

```bash
heroku open
```

Or view logs:

```bash
heroku logs --tail
```

## 9. Common troubleshooting

- If the app does not start, verify `app.js` is present and the `start` script is defined in `package.json`.
- If MongoDB fails to connect, verify `MONGODB_URI` and that your database is reachable.
- If port issues occur, confirm `PORT` is not already in use.

## 10. Next steps

- Add authentication and session handling
- Implement the game logic and routes
- Add validation for form submissions
- Improve the UI in `views/` and `public/css/`

## Notes

These documents intentionally avoid hard-coded secrets and API keys. Keep all sensitive data in environment configuration files and platform environment settings.
