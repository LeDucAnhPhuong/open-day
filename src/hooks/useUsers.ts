'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { User } from '@/types/api';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const useUsers = (token: string | null): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (): Promise<void> => {
    if (!token) {
      setError('No authentication token provided');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.get<User[]>('/auth/users', token);
      setUsers(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  const returnValue = useMemo(() => ({
    users,
    isLoading,
    error,
    fetchUsers,
  }), [users, isLoading, error, fetchUsers]);

  return returnValue;
};