"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import { AuthResponse, LoginDto, RegisterDto, User } from "@/types/api";
import { useCookies } from "react-cookie";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  refreshAuth: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [cookies, setCookie] = useCookies(["access_token"], {
    doNotParse: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const token = cookies.access_token;
      const userStr = localStorage.getItem("auth_user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginDto): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      const { user, access_token } = response;

      localStorage.setItem("auth_token", access_token);

      setCookie("access_token", access_token as string);
      localStorage.setItem("auth_user", JSON.stringify(user));

      setState({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterDto): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        userData
      );

      const { user, access_token } = response;

      setCookie("access_token", access_token as string);

      localStorage.setItem("auth_user", JSON.stringify(user));

      setState({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback((): void => {
    setCookie("access_token", undefined);
    localStorage.removeItem("auth_user");

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refreshAuth = useCallback((): void => {
    try {
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("auth_user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error refreshing auth state:", error);
      logout();
    }
  }, [logout]);

  const returnValue = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      refreshAuth,
    }),
    [state, login, register, logout, refreshAuth]
  );

  return returnValue;
};
