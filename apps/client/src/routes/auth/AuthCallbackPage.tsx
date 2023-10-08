import { treaty } from "@nutrishare/libs";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

// TODO: Get this type from backend (from treaty?)
// TODO: Extract types to a shared module (if not possible to get from treaty)
type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string | null;
};

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string>();
  // TODO: Save User in global state
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const accessToken = searchParams.get("token");
    if (accessToken === null) {
      // TODO: Better error handling
      console.log("No token found in URL");
      return;
    }
    // TODO: Save the token somewhere safe
    setToken(accessToken);
  }, [searchParams]);

  useEffect(() => {
    const getUser = async () => {
      const res = await treaty.api.auth.me.get({
        $headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 200 || res.data === null) {
        // TODO: Better error handling
        console.log("Error getting user");
        return;
      }

      setUser(res.data);
    };

    if (token) getUser();
  }, [token]);

  return (
    <>
      <h1>Auth Callback</h1>
      <div>{token && <pre>{token}</pre>}</div>
      <div>
        {user && (
          <p>
            {user.username} ({user.id})
          </p>
        )}
      </div>
      <Link to="/">Homepage</Link>
    </>
  );
};

export default AuthCallbackPage;
