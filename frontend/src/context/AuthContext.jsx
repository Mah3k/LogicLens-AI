import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, registerRequest } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("logiclens_user") ||
      sessionStorage.getItem("logiclens_user");

    const token =
      localStorage.getItem("logiclens_token") ||
      sessionStorage.getItem("logiclens_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password, remember = false) => {
    const { user: u, token } = await loginRequest(email, password);

    const storage = remember ? localStorage : sessionStorage;

    storage.setItem("logiclens_token", token);
    storage.setItem("logiclens_user", JSON.stringify(u));

    // Clear the other storage
    if (remember) {
      sessionStorage.removeItem("logiclens_token");
      sessionStorage.removeItem("logiclens_user");
    } else {
      localStorage.removeItem("logiclens_token");
      localStorage.removeItem("logiclens_user");
    }

    setUser(u);

    return u;
  };

  const register = async (name, email, password) => {
    const { user: u, token } = await registerRequest(name, email, password);

    // New registrations stay logged in permanently
    localStorage.setItem("logiclens_token", token);
    localStorage.setItem("logiclens_user", JSON.stringify(u));

    setUser(u);

    return u;
  };

  const updateUser = (updatedUser) => {
    if (localStorage.getItem("logiclens_token")) {
      localStorage.setItem("logiclens_user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("logiclens_user", JSON.stringify(updatedUser));
    }

    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("logiclens_token");
    localStorage.removeItem("logiclens_user");
    setUser(null);

    
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
