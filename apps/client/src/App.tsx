import { Link } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import { useAuthContext } from "./context/authContext";
import { treaty } from "@nutrishare/libs";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string | null;
};

const App = () => {
  const { accessToken, setAccessToken } = useAuthContext();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      const res = await treaty.api.auth.me.get({
        $headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status !== 200 || res.data === null) {
        // TODO: Better error handling
        console.log("Error getting user");
        return;
      }

      setUser(res.data);
    };

    if (accessToken) getUser();
  }, [accessToken]);

  const onLogout = () => {
    setAccessToken(null);
    setUser(undefined);
  }

  return (
    <>
      <h1>NutriShare</h1>

      {user && (
        <div>
          <p>

          Logged in as {user.username} ({user.id})
          </p>
          <button type="button" onClick={onLogout}>Logout</button>
        </div>
      )}
      {user === undefined && (
        <div>
          <Link to="/auth/login">
            <button type="button">Login</button>
          </Link>
          <Link to="/auth/register">
            <button type="button">Register</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default App;
