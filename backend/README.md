
# Backend

This is the backend for the MERN Book Store application. It is built with Node.js, Express, and MongoDB.

## API Endpoints

The following table lists the available API endpoints.

| Method | Endpoint         | Description                                   |
| ------ | ---------------- | --------------------------------------------- |
| `POST` | `/upload-book`   | Add a new book to the database.               |
| `GET`  | `/all-books`     | Get all books, or filter by category.         |
| `GET`  | `/book/:id`      | Get a single book by its ID.                  |
| `PATCH`| `/book/:id`      | Update a book's data.                         |
| `DELETE`| `/book/:id`    | Delete a book by its ID.                      |

### Get All Books (with optional category filter)

*   **URL:** `/all-books`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `category` (optional): Filter books by category.
*   **Success Response:**
    *   **Code:** 200
    *   **Content:** An array of book objects.

## Setup

1.  **Install dependencies:**
    ```sh
    npm install
    ```
2.  **Create a `.env` file** in the `backend` directory and add your MongoDB connection string:
    ```
    MONGO_URI=your_mongodb_connection_string
    ```
3.  **Start the server:**
    ```sh
    npm start
    ```
The server will start on port 5000.
