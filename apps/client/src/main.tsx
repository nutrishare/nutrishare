import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthCallbackPage from "./routes/auth/AuthCallbackPage";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth/callback", element: <AuthCallbackPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
