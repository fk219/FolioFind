import './theme.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import router from './routers/router.jsx'
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthProvider.jsx'
import { ShelfProvider } from './contexts/ShelfProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ShelfProvider>
        <RouterProvider router={router}></RouterProvider>
      </ShelfProvider>
    </AuthProvider>
  </React.StrictMode>,
)
