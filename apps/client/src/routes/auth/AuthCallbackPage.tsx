import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthContext();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    if (accessToken === null) {
      // TODO: Better error handling
      console.log("No token found in URL");
      return;
    }

    setAccessToken(accessToken);
    navigate("/auth/success");
  }, [searchParams, setAccessToken, navigate]);

  return (
    <>
      <h1>Auth Callback</h1>
    </>
  );
};

export default AuthCallbackPage;
