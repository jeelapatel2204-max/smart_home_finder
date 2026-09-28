# Smart Home Finder

Smart Home Finder is a consumer real-estate decision platform. It helps buyers understand true ownership cost, personal fit, and tradeoffs for a home instead of only browsing listings.

The current application is a Next.js frontend prototype with mock property data, neighborhood previews, local favorites, and an investment scenario calculator.

## Documentation

The product vision, delivery scope, architecture, and operational guidance are in [docs/README.md](./docs/README.md). Start with [docs/app_idea.md](./docs/app_idea.md).

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The production build downloads the configured Geist fonts during build, so it needs network access unless the font setup is changed to local assets.
