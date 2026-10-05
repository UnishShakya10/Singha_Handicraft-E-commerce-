# Singha Handicraft

A storefront for handcrafted Buddhist sculpture from Patan, Nepal. Built with React, Vite, Tailwind CSS, and React Router.

## Features

- Home, shop, gallery, and about
- Collection search and cart (saved in the browser)
- Account login and signup against the local API
- Responsive layout with a shared header and footer

## Run locally

Start the backend first. It requires MongoDB; configure its environment file:

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env`, set `DB_URL` and a private
`JWT_SECRET`, then start the server:

```bash
node index.js
```

In a second terminal, start the frontend from the repository root:

```bash
npm install
npm run dev
```

The frontend uses `http://localhost:8080` by default. Set `VITE_API_URL` if
the backend is hosted elsewhere. The backend source is in the `backend` folder.
