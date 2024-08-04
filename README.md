# Inventory Management System

## Tech Used

- React
- Node.js
- Express
- MongoDB

## Application Summary

This application is an inventory management system designed to streamline the process of managing vendors, products, and orders.

## Flow

1. **Creating a Vendor**: The application allows users to create vendors, who are suppliers of products.
2. **Creating a Product**: Users can add products to the inventory, linking them to the created vendors.
3. **Making an Order**: Orders can be created for the products using the associated vendors (Purchase order in UI and Sale order using `<API>`).
4. **Updating Order State**: The state of an order can be updated using an API (`<API>`).
5. **Orders Page**: All orders are displayed on the orders page.
6. **Download Order Details**: Users can download order details as a CSV file from the orders page.

## API Endpoints

**Making an Order** :

curl --location 'https://inventory-y3ju.onrender.com/orders/create-order' \
 --header 'Authorization: Bearer <token>' \
 --header 'Content-Type: application/json' \
 --data '{
"productId": 1,
"vendorId": 1,
"quantity": 1,
"pricePerQuantity": 80,
"transactionType" : "sale",
"totalPrice": 80,
"orderStatus": "ordered",
"customerId": 1
}'

**Updating Order State** :

curl --location --request PUT 'https://inventory-y3ju.onrender.com/orders/change-status/1' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
"orderStatus" : "shipped"
}'

orderStatus is an enum : ["ordered", "shipped", "completed"]
