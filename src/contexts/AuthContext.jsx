import React, { createContext, useContext, useState } from "react";
import { getData, saveData, newId } from "../services/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Require login first by default in a new session unless explicitly remembered
  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      const isSession = sessionStorage.getItem("netflowLoggedIn") === "true";
      const isRemember = localStorage.getItem("netflowRemember") === "true";
      const isLocal = localStorage.getItem("netflowLoggedIn") === "true";
      return isSession || (isRemember && isLocal);
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const sessionUser = sessionStorage.getItem("netflowCurrentUser");
      if (sessionUser) return JSON.parse(sessionUser);
      const isRemember = localStorage.getItem("netflowRemember") === "true";
      if (isRemember) {
        const localUser = localStorage.getItem("netflowCurrentUser");
        return localUser ? JSON.parse(localUser) : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = (email, password, remember = false) => {
    const persistAuth = (user) => {
      // Always store in session
      sessionStorage.setItem("netflowLoggedIn", "true");
      sessionStorage.setItem("netflowCurrentUser", JSON.stringify(user));

      if (remember) {
        localStorage.setItem("netflowRemember", "true");
        localStorage.setItem("netflowLoggedIn", "true");
        localStorage.setItem("netflowCurrentUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("netflowRemember");
        localStorage.removeItem("netflowLoggedIn");
        localStorage.removeItem("netflowCurrentUser");
      }
      setLoggedIn(true);
      setCurrentUser(user);
    };

    // Check demo credentials
    if (email === "admin@netflow.com" && password === "admin123") {
      const user = {
        name: "System Administrator",
        email: "admin@netflow.com",
        role: "Administrator",
        phone: "+91 9876543210",
        designation: "Network Administrator",
        bio: "Responsible for monitoring campus network infrastructure and IT resources.",
        location: "Chandigarh, India",
      };
      persistAuth(user);
      return { success: true };
    }

    // Check registered users
    const users = getData("users");
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (found) {
      if (found.password && found.password !== password) {
        return { success: false, error: "Incorrect password." };
      }
      const user = {
        name: found.name,
        email: found.email,
        role: found.role || "Student",
        phone: found.phone || "",
        designation: found.designation || found.role || "Student",
        bio: found.bio || "",
        location: found.location || "",
      };
      persistAuth(user);
      return { success: true };
    }

    // Fallback permissive login if password length >= 6
    if (email && password.length >= 6) {
      const user = {
        name: email.split("@")[0] || "User",
        email,
        role: "Student",
        phone: "",
        designation: "Student",
        bio: "",
        location: "",
      };
      persistAuth(user);
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid credentials. Use admin@netflow.com / admin123 for the demo.",
    };
  };

  const signup = ({ name, email, role, password }) => {
    if (!name || !email || !password) {
      return { success: false, error: "Please fill in all required fields." };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must contain at least 6 characters.",
      };
    }
    const users = getData("users");
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    const newUser = {
      id: newId("U"),
      name,
      email,
      role: role || "Student",
      status: "Active",
      password,
      phone: "",
      designation: role || "Student",
      bio: "",
      location: "",
    };

    saveData("users", [...users, newUser]);
    return { success: true, user: newUser };
  };

  const updateProfile = (data) => {
    const updated = {
      ...(currentUser || {}),
      ...data,
    };
    try {
      sessionStorage.setItem("netflowCurrentUser", JSON.stringify(updated));
      localStorage.setItem("netflowCurrentUser", JSON.stringify(updated));
    } catch {}
    setCurrentUser(updated);

    // Also update in registered users list if found
    const users = getData("users");
    const idx = users.findIndex(
      (u) => u.email && updated.email && u.email.toLowerCase() === updated.email.toLowerCase()
    );
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveData("users", users);
    }
    return updated;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem("netflowLoggedIn");
      sessionStorage.removeItem("netflowCurrentUser");
      localStorage.removeItem("netflowLoggedIn");
      localStorage.removeItem("netflowCurrentUser");
      localStorage.removeItem("netflowRemember");
    } catch {}
    setLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        currentUser,
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
