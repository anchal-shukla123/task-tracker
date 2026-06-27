# Task Tracker MERN App

A full-stack Task Tracker built with React, Node.js, Express, and MongoDB.

## Features

- Create, view, update, and delete tasks
- Form validation on the client and API
- REST API with MongoDB persistence
- Dynamic UI updates without page refresh
- Filtering, sorting, task status changes, and toast notifications
- Responsive React interface
- Environment-variable based configuration

## Project Structure

```text
client/   React + Vite frontend
server/   Express + MongoDB backend
```

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Update `server/.env` with your MongoDB connection string.

4. Start the app:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:5000`.

## Deployment

Backend deployment targets such as Render or Railway can run:

```bash
npm install --prefix server
npm start --prefix server
```

Set these backend environment variables:

- `MONGODB_URI`
- `CLIENT_ORIGIN`
- `PORT`

Frontend deployment targets such as Vercel or Netlify can use:

```bash
npm install --prefix client
npm run build --prefix client
```

Set this frontend environment variable to the deployed backend URL:

- `VITE_API_URL`
