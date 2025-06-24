import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthResult {
  login: (email: string, password: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
}

export function useAuth(): AuthResult {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        navigate("/projects");
        return true;
      } else {
        const errData = await res.json();
        setError(errData.message || "Login failed.");
        return false;
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Login failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
}
