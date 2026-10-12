# Mint Market

A responsive vending-machine storefront and stock manager built with the latest stable Angular, Angular signals, and Node.js. The mock products API serves its initial product list from a local JSON file. Creating, editing, and deleting products, as well as purchases and stock changes, update the Angular application state only; refreshing the page reloads the original product list.

## Requirements

- Node.js 24.15.0 or later in the 24.x line, or Node.js 22.22.3 or later in the 22.x line (required by Angular 22)
- npm 11 or later

## Install and run

```bash
npm install
npm start
```

`npm start` serves the Angular application at <http://localhost:4200>. In a **second terminal**, start the mock products API:

```bash
npm run api
```

The frontend development server proxies `/api` requests to `http://127.0.0.1:3000`. Start the API before loading or refreshing the storefront.

To make a production build:

```bash
npm run build
```

## Vending machine

- Add, edit, and remove products from **Manage stock**. Stock can range from 0 to 15 units for each product type. Each type must have a different price.
- Select an available product, then insert coins to pay. Successful purchases deduct one unit from the in-memory stock and return the correct change when the machine has the coins available.
- Use **Change of heart?** to return all inserted coins without buying anything.
- The machine accepts **€0.10, €0.20, €0.50, €1, and €2 coins only**. The machine starts with a small change float. Purchases are disabled if it cannot make the exact required change.
- Prices and all payment/change calculations use whole euro cents.

## Mock API and data

- `GET /api/products` returns the initial list from [`data/products.json`](./data/products.json).
- The API intentionally exposes no write operations. All product CRUD and stock changes live in the Angular application's signal-backed state; they do not alter the JSON file or survive a page refresh.
- The API server uses Node's built-in HTTP module; no database or separate server dependencies are required.

## Formatting

Prettier configuration is shared through [`.prettierrc`](./.prettierrc) (including Angular HTML formatting). VS Code is configured to format on save; install the recommended **Prettier – Code formatter** extension.

Format all supported project source, configuration, and documentation files with:

```bash
npm run format
```

Check formatting without changing files:

```bash
npm run format:check
```
