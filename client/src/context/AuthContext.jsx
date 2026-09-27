
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5001";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => sessionStorage.getItem("careerforge_token")
  );
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verify an existing session when the app loads.
  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();

        if (!cancelled) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          sessionStorage.removeItem("careerforge_token");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsCheckingAuth(false);
        }
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [token]);

  function login(authToken, userData) {
    sessionStorage.setItem(
      "careerforge_token",
      authToken
    );

    setToken(authToken);
    setUser(userData);
    setIsCheckingAuth(false);
  }

  function logout() {
    sessionStorage.removeItem("careerforge_token");
    setToken(null);
    setUser(null);
    setIsCheckingAuth(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isCheckingAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}