# Singha Handicraft

A storefront for handcrafted Buddhist sculpture from Patan, Nepal. Built with React, Vite, Tailwind CSS, and React Router.

## Features

- Home, shop, gallery, and about
- Collection search and cart (saved in the browser)
- Account login and signup against the local API
- Responsive layout with a shared header and footer

## Run locally

```bash
npm install
npm run dev
```

Local development uses `http://localhost:8080` by default. Production builds use the deployed API at `https://singha-handicraft-backend.onrender.com`; set `VITE_API_URL` in the deployment environment if the API is hosted elsewhere.

In local development, loopback API URLs are adjusted to the hostname used to open the site so other devices on the same network can reach the development API. Production defaults to the deployed Render API above. Existing product catalog images are bundled under `public/uploads` and served by Vercel. New uploads made through the admin panel still use the backend's local disk and are not persistent across Render restarts; use direct image URLs or a persistent image-storage service for new production uploads.
