# [Portfolio of Pablo Wynistorf](https://www.pablo.one)

React 19 + Vite + Tailwind CSS v4 + Motion, with components from Magic UI and Aceternity UI.

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # outputs dist/
```

- Content lives in `src/data/content.ts`. Route slugs for static deep links are in `src/data/routes.json`.
- Images are in `public/media/`.
- A push to `master` deploys to GitHub Pages through `.github/workflows/deploy.yml`.
- A commit message containing `docker` also builds and pushes `pablo06/portfolio:latest`.
