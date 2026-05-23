import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../pages/Home/Home";
import { DashboardLayout } from "../Dashboard/DashboardLayout";
import AdminRoute from "../PrivateRoute/AdminRoute";
import { getBook } from "../api/books";

const Shop = lazy(() => import("../pages/Shop/Shop"));
const SingleBook = lazy(() => import("../pages/shared/SingleBook"));
const SellBook = lazy(() => import("../pages/SellBook"));
const MyListings = lazy(() => import("../pages/MyListings"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Logout = lazy(() => import("../pages/Logout"));
const ErrorPage = lazy(() => import("../pages/shared/ErrorPage"));
const About = lazy(() => import("../pages/about/About"));
const Blog = lazy(() => import("../pages/blog/Blog"));
const UploadBook = lazy(() => import("../Dashboard/UploadBook"));
const Dashboard = lazy(() => import("../Dashboard/Dashboard"));
const ManageBooks = lazy(() => import("../Dashboard/ManageBooks"));
const EditBooks = lazy(() => import("../Dashboard/EditBooks"));

function Lazy({ children }) {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Lazy><ErrorPage /></Lazy>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/shop", element: <Lazy><Shop /></Lazy> },
      { path: "/book/:id", element: <Lazy><SingleBook /></Lazy>, loader: ({ params }) => getBook(params.id) },
      { path: "/about", element: <Lazy><About /></Lazy> },
      { path: "/blog", element: <Lazy><Blog /></Lazy> },
      { path: "/sell", element: <Lazy><SellBook /></Lazy> },
      { path: "/my-listings", element: <Lazy><MyListings /></Lazy> }
    ]
  },
  {
    path: "/admin/dashboard",
    element: <AdminRoute><DashboardLayout /></AdminRoute>,
    children: [
      { path: "/admin/dashboard", element: <Lazy><Dashboard /></Lazy> },
      { path: "/admin/dashboard/upload", element: <Lazy><UploadBook /></Lazy> },
      { path: "/admin/dashboard/manage", element: <Lazy><ManageBooks /></Lazy> },
      { path: "/admin/dashboard/edit-books/:id", element: <Lazy><EditBooks /></Lazy>, loader: ({ params }) => getBook(params.id) }
    ]
  },
  { path: "login", element: <Lazy><Login /></Lazy> },
  { path: "/create-user", element: <Lazy><Signup /></Lazy> },
  { path: "/logout", element: <Lazy><Logout /></Lazy> }
]);

export default router;