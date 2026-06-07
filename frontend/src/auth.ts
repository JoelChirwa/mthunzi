/**
 * JWT Authentication Utilities
 * Uses custom JWT tokens stored in localStorage
 * Backend handles token generation and validation
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

/**
 * Get the JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Get the current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: string | string[]): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
}

/**
 * Clear authentication (logout)
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
