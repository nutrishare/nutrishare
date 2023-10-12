import { treaty } from "@nutrishare/libs";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/authContext";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string | null;
};

const AuthSuccessPage = () => {
  const { accessToken } = useAuthContext();
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

  return (
    <>
      <h1>Success</h1>

      <div>
        {user && (
          <p>
            {user.username} ({user.id})
          </p>
        )}
      </div>
    </>
  );
};

export default AuthSuccessPage;
