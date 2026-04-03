"use client";
import { createContext, useContext, useEffect, useState } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("admin");
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem("ai_finance_role");
    if (savedRole === "admin" || savedRole === "viewer") setRole(savedRole);

    const savedDemo = localStorage.getItem("ai_finance_demo_mode");
    // default true if never set
    setIsDemoMode(savedDemo === null ? true : savedDemo === "true");
  }, []);

  const toggleRole = () => {
    setRole((prev) => {
      const next = prev === "admin" ? "viewer" : "admin";
      localStorage.setItem("ai_finance_role", next);
      return next;
    });
  };

  const toggleDemo = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      localStorage.setItem("ai_finance_demo_mode", String(next));
      return next;
    });
  };

  return (
    <RoleContext.Provider value={{ role, toggleRole, isAdmin: role === "admin", isDemoMode, toggleDemo }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);