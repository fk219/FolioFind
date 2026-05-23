
# Backend

This is the backend for the MERN Book Store application. It is built with Node.js, Express, and MongoDB.

## API Endpoints

| Method | Endpoint         | Auth Required | Description                          |
| ------ | ---------------- | ------------- | ------------------------------------ |
| `POST` | `/api/auth/register` | No        | Register a new user account          |
| `POST` | `/api/auth/login`    | No        | Login with email and password        |
| `GET`  | `/api/auth/me`       | Yes       | Get current authenticated user       |
| `GET`  | `/api/books`         | No        | Get all books (optional ?category=)  |
| `GET`  | `/api/books/:id`     | No        | Get a single book by ID              |
| `POST` | `/api/books`         | Admin     | Create a new book                    |
| `PATCH`| `/api/books/:id`     | Admin     | Update a book                        |
| `DELETE`| `/api/books/:id`    | Admin     | Delete a book                        |

Books are stored with these fields: `bookTitle`, `authorName`, `imageURL`, `category`, `bookDescription`, `bookPDFURL`, `price`.

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
