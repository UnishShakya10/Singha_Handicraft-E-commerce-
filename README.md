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

Optional: set `VITE_API_URL` if the user API is not at `http://localhost:8080`.

When opening the development site on a phone, the API must be reachable from that phone. Loopback API URLs such as `localhost` are resolved to the hostname used to open the site; for production, set `VITE_API_URL` to the publicly reachable API URL.
