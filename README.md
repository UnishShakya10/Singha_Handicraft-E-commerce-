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

When opening the site from another device, the API must be reachable from that device. If `VITE_API_URL` is unset or points to a loopback host such as `localhost`, the app uses the hostname and protocol used to open the site, keeping API calls and uploaded images on the same reachable host. If the API is hosted separately, set `VITE_API_URL` to its publicly reachable URL and redeploy.
