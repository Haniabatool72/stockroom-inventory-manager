# Testing Checklist

## Add products
- [ ] Add a valid product; it appears in the table and a success message shows
- [ ] Dashboard totals update immediately
- [ ] Form clears after saving

## Validation
- [ ] Empty name shows an error
- [ ] Empty category shows an error
- [ ] Empty or negative price shows an error
- [ ] Empty, negative or decimal stock shows an error
- [ ] Adding a duplicate product name is blocked

## Edit
- [ ] Edit loads the product values into the form
- [ ] Saving updates the table and dashboard
- [ ] Cancel edit resets the form to "Add product"

## Delete
- [ ] Delete shows a confirmation dialog
- [ ] Cancelling keeps the product
- [ ] Confirming removes it and shows a message

## Search and filters
- [ ] Search matches names, ignoring case
- [ ] Category filter shows only that category
- [ ] Search and filter work together
- [ ] "No products match" message shows when nothing is found
- [ ] Deleting the last product in a category resets the filter

## Low-stock alerts
- [ ] Stock of 5 or less shows the banner, highlighted row and "Low stock" badge
- [ ] Stock of 0 shows "Out of stock"
- [ ] Stock above 5 shows "In stock" and no alert
- [ ] Low-stock count on the dashboard is correct

## Dashboard
- [ ] Total products equals the number of products
- [ ] Total units equals the sum of all stock
- [ ] Stock value equals the sum of price × stock

## Storage
- [ ] Data stays after refreshing the page
- [ ] Data stays after closing and reopening the browser
- [ ] The app works with empty storage (first visit)

## Security
- [ ] A name like `<b>test</b>` is displayed as plain text

## Responsive and UI
- [ ] Layout works at desktop, tablet (~800px) and phone (~375px) widths
- [ ] The table scrolls sideways on small screens
- [ ] Keyboard Tab shows a visible focus outline
- [ ] Footer shows "Developed by HANIA Batool"
