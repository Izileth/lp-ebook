// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { BookPage } from "../pages/BookPage";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { LoginPage } from "../pages/LoginPage"; // <--- Add this import

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/ebook/:bookId",
    element: <BookPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  { // <--- Add this new route
    path: "/login",
    element: <LoginPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
