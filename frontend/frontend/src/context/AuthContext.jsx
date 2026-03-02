import { createContext, useState, useContext, useCallback } from "react";
import { setAuthToken, clearAuthToken } from "../services/api";

// ─── Create context ───────────────────────────────────────────────────────────
export const AuthContext = createContext();

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {

  // Safely rehydrate user from localStorage on first load
  let storedUser = null;
  try {
    const item = localStorage.getItem("user");
    storedUser = item ? JSON.parse(item) : null;
  } catch (err) {
    console.error("Failed to parse stored user:", err);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // clean up orphaned token too
    storedUser = null;
  }

  // ✅ FIX: On rehydration, restore the token into axios headers immediately.
  // Without this, a page refresh clears the axios default header even though
  // the token is still in localStorage, causing 401s after refresh.
  if (storedUser?.token) {
    setAuthToken(storedUser.token);
  }

  const [user, setUser] = useState(storedUser);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    const userData = {
      token: data.token,
      id: data.user_id,
      type: data.user_type,
      name: data.full_name,
      email: data.email,
    };

    // ✅ FIX: Save token separately under the key "token" so api.js interceptor
    // can find it with localStorage.getItem("token"). Also sets axios default header.
    setAuthToken(userData.token);

    // Save the full user object for UI use
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  // ── LOGOUT ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    // ✅ FIX: Clear both the user object AND the token key, and remove the
    // axios Authorization header so no stale token leaks into future requests.
    clearAuthToken();
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  // ── REGISTER ───────────────────────────────────────────────────────────────
  const register = useCallback(async (
    full_name, email, phone_number, password, user_type, location
  ) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, phone_number, password, user_type, location }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    // Auto-login after successful registration
    await login(email, password);
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom hook ─────────────────────────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);