# Frontend

This is the frontend for the MERN Book Store application. It is built with React, Vite, and Tailwind CSS.

## Features

*   View a list of all books.
*   Filter books by category.
*   View the details of a single book.
*   Add new books to the store.
*   Update existing books.
*   Delete books from the store.
*   User authentication with Firebase.

## Setup

1.  **Install dependencies:**
    ```sh
    npm install
    ```
2.  **Create a `.env` file** in the `frontend` directory and add your Firebase configuration:
    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
3.  **Start the development server:**
    ```sh
    npm run dev
    ```
The application will be available at `http://localhost:5173`.
