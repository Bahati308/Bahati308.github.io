Night Sky — React + Vite + Tailwind

An interactive night sky rendered on a canvas: knockable stars, periodic shooting-star commits, orbiting planets with moons, and a rising sun at daybreak. Built with React, Vite, and Tailwind CSS.


Features

- Stars: Tap or drag to nudge nearby stars; they move with inertia and bounce at edges.
- Commits (shooting stars): Periodic streaks; spawn instantly with the Commit button.
- Planets and moons: Bodies orbit the center at different radii and speeds.
- Sun / Daybreak: Toggle daybreak to raise the sun and warm the horizon gradient.


Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3


Getting Started

1) Install dependencies

    npm install

2) Start the dev server

    npm run dev

The app will open on http://localhost:5173.


Available Scripts

- Development:

    npm run dev

- Production build:

    npm run build

- Preview production build locally:

    npm run preview


Project Structure

- index.html — Vite entry mounting React.
- src/main.jsx — React bootstrap.
- src/App.jsx — Canvas simulation and UI sections.
- src/index.css — Tailwind directives and utility-based styles.
- tailwind.config.js — Tailwind content scanning and theme extensions.
- postcss.config.js — Tailwind + autoprefixer pipeline.
- vite.config.js — Vite config with React plugin.


Usage Notes

- Interaction: Click/drag inside the canvas to push stars.
- Buttons: Add Stars, Clear, Commit (☄︎), Toggle Daybreak control the scene.


Deploying (GitHub Pages)

1) Build the site:

    npm run build

2) Serve the contents of the dist directory with GitHub Pages (e.g., push dist to a gh-pages branch or configure your hosting to serve dist/).


License

MIT
