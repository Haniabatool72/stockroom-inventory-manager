# Stockroom – Inventory Management System

A clean, responsive inventory manager built with plain HTML, CSS and vanilla JavaScript. Track products, watch stock levels and see your total stock value. Everything is saved in your browser, with no backend and no libraries.

## Features

- Add, edit and delete products
- Product name, category, price and stock quantity
- Search by name and filter by category
- Low-stock alerts (banner, row highlight and status badge)
- Dashboard: total products, total units, stock value and low-stock count
- Data saved with LocalStorage and restored on reload
- Form validation with inline errors and a duplicate-name check
- Confirmation messages (toasts) and a delete confirmation dialog
- Responsive layout for phones, tablets and desktops

## Technologies

- HTML5
- CSS3 (Grid, Flexbox, CSS variables)
- JavaScript (ES6+)
- Browser LocalStorage

## Project structure

```
stockroom-inventory-manager/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Haniabatool72/stockroom-inventory-manager.git
   ```
2. Open the folder:
   ```bash
   cd stockroom-inventory-manager
   ```
3. Open `index.html` in any modern browser. No build step or installation is needed.

## Configuration

The low-stock limit is set at the top of `script.js`:

```js
const LOW_STOCK_LIMIT = 5;
```

## Screenshots

> Add your screenshots to a `screenshots/` folder and update the paths below.

| Dashboard | Add / edit form | Mobile view |
|-----------|-----------------|-------------|
| ![Dashboard](screenshots/dashboard.png) | ![Form](screenshots/form.png) | ![Mobile](screenshots/mobile.png) |

## Future improvements

- Sort the table by any column
- Export and import data (CSV or JSON)
- Dark mode
- Product SKU or barcode field
- Pagination for large inventories
- Stock history and activity log
- Charts for stock by category
- Backend and database for multi-user access

## Author

Developed by HANIA Batool
