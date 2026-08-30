# E-commerce technical challenge

React Router v7 (framework mode) + TypeScript + Tailwind CSS v4.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

`.env` holds `PRODUCTS_API_URL` (the products API base URL). It is loaded in
development via `dotenv` (see `vite.config.ts`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `react-router typegen` + `tsc` |

## Notes on the stack

The project is pinned to **React Router v7 + Vite 6**. The `create-react-router`
default (React Router 8 / Vite 8) needs Node ≥ 22.12; this machine has 22.9, so
the pin keeps it runnable.
