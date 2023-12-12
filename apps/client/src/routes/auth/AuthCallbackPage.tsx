import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken } = useAuthContext();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    if (accessToken === null || refreshToken === null) {
      // TODO: Better error handling
      console.log("No token found in URL");
      return;
    }

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    navigate("/");
  }, [searchParams, setAccessToken, setRefreshToken, navigate]);

  return (
    <>
      <h1>Auth Callback</h1>
    </>
  );
};

export default AuthCallbackPage;
