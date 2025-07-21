# MERN Book Store

This is a full-stack MERN (MongoDB, Express, React, Node.js) application for managing a book store. It includes features for viewing, adding, updating, and deleting books.

## Tech Stack

*   **Frontend:**
    *   React
    *   React Router
    *   Tailwind CSS
    *   Vite
    *   Firebase Authentication
*   **Backend:**
    *   Express
    *   MongoDB
    *   Node.js

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed
*   MongoDB Atlas account or local MongoDB installation

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/your_project.git
    ```
2.  **Install backend dependencies**
    ```sh
    cd backend
    npm install
    ```
3.  **Install frontend dependencies**
    ```sh
    cd ../frontend
    npm install
    ```

### Usage

1.  **Set up backend**
    *   Create a `.env` file in the `backend` directory and add your MongoDB connection string:
        ```
        MONGO_URI=your_mongodb_connection_string
        ```
    *   Start the backend server:
        ```sh
        cd backend
        npm start
        ```
2.  **Set up frontend**
    *   Create a `.env` file in the `frontend` directory and add your Firebase configuration:
        ```
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        ```
    *   Start the frontend development server:
        ```sh
        cd frontend
        npm run dev
        ```

Now, you can view the application in your browser at `http://localhost:5173`.
