/// <reference lib="dom" />

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, [setAccessToken]);

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (token) setRefreshToken(token);
  }, [setRefreshToken]);

  useEffect(() => {
    if (accessToken === null) {
      localStorage.removeItem("accessToken");
      return;
    }
    localStorage.setItem("accessToken", accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken === null) {
      localStorage.removeItem("refreshToken");
      return;
    }
    localStorage.setItem("refreshToken", refreshToken);
  }, [refreshToken]);

    localStorage.setItem("refreshToken", token);
    _setRefreshToken(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, refreshToken, setRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (authContext === null) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }

  return authContext;
};
