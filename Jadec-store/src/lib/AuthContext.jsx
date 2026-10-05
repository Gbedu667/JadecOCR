import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "jadec_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Invalid stored user:", error);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setAppPublicSettings(null);
    } catch (error) {
      console.error("Auth state check failed:", error);

      setAuthError({
        type: "unknown",
        message: error.message || "Failed to load authentication state"
      });

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);

      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedUser) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const currentUser = JSON.parse(storedUser);

      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error("User auth check failed:", error);

      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);

      setAuthError({
        type: "auth_required",
        message: "Authentication required"
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);

    if (shouldRedirect) {
      window.location.href = "/";
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
        checkUserAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};