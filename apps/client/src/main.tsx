import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthCallbackPage from "./routes/auth/AuthCallbackPage";
import LoginPage from "./routes/auth/LoginPage";
import RegisterPage from "./routes/auth/RegisterPage.tsx";
import AuthSuccessPage from "./routes/auth/AuthSuccessPage.tsx";
import { AuthContextProvider } from "./context/authContext.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/auth/register", element: <RegisterPage /> },
  { path: "/auth/callback", element: <AuthCallbackPage /> },
  { path: "/auth/success", element: <AuthSuccessPage /> },
  { path: "*", element: <div>404</div> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>,
);
