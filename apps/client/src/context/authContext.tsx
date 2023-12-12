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
  const [accessToken, _setAccessToken] = useState<string | null>(null);
  const [refreshToken, _setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    _setAccessToken(token);
  }, [_setAccessToken]);

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    _setRefreshToken(token);
  }, [_setRefreshToken]);

  const setAccessToken = useCallback((token: string | null) => {
    if (token === null) {
      localStorage.removeItem("accessToken");
      return;
    }

    localStorage.setItem("accessToken", token);
    _setAccessToken(token);
  }, []);

  const setRefreshToken = useCallback((token: string | null) => {
    if (token === null) {
      localStorage.removeItem("refreshToken");
      return;
    }

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
