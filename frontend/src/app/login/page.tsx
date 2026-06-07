"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists, redirect to admin
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // Save token and user details in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to admin dashboard
      router.push("/admin");
      // Force page reload so the middleware/layout picks up the token change
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your organization credentials to access the admin dashboard.
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
