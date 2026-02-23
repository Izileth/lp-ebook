// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { BookPage } from "../pages/BookPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/ebook/:bookId",
    element: <BookPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
