"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Challenge,
  CreateChallengeDto,
  UpdateChallengeDto,
  ChallengeLevel,
} from "@/types/api";

interface UseChallengesReturn {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  fetchChallenges: (level?: ChallengeLevel) => Promise<void>;
  createChallenge: (data: CreateChallengeDto) => Promise<Challenge>;
  updateChallenge: (id: string, data: UpdateChallengeDto) => Promise<Challenge>;
  deleteChallenge: (id: string) => Promise<void>;
  getChallengeById: (id: string) => Promise<Challenge>;
}

export const useChallenges = (token: string | null): UseChallengesReturn => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(
    async (level?: ChallengeLevel): Promise<void> => {
      if (!token) {
        setError("No authentication token provided");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const endpoint = level ? `/challenges?level=${level}` : "/challenges";
        const response = await apiClient.get<Challenge[]>(endpoint, token);
        setChallenges(response);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch challenges";
        setError(errorMessage);
        console.error("Error fetching challenges:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const createChallenge = useCallback(
    async (data: CreateChallengeDto): Promise<Challenge> => {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      try {
        const response = await apiClient.post<Challenge>(
          "/challenges",
          data,
          token
        );
        setChallenges((prev) => [response, ...prev]);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create challenge";
        setError(errorMessage);
        throw err;
      }
    },
    [token]
  );

  const updateChallenge = useCallback(
    async (id: string, data: UpdateChallengeDto): Promise<Challenge> => {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      try {
        const response = await apiClient.put<Challenge>(
          `/challenges/${id}`,
          data,
          token
        );
        setChallenges((prev) => prev.map((c) => (c._id === id ? response : c)));
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update challenge";
        setError(errorMessage);
        throw err;
      }
    },
    [token]
  );

  const deleteChallenge = useCallback(
    async (id: string): Promise<void> => {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      try {
        await apiClient.delete(`/challenges/${id}`, token);
        setChallenges((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete challenge";
        setError(errorMessage);
        throw err;
      }
    },
    [token]
  );

  const getChallengeById = useCallback(
    async (id: string): Promise<Challenge> => {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      try {
        const response = await apiClient.get<Challenge>(
          `/challenges/${id}`,
          token
        );
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch challenge";
        setError(errorMessage);
        throw err;
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchChallenges();
    }
  }, [token, fetchChallenges]);

  const returnValue = useMemo(
    () => ({
      challenges,
      isLoading,
      error,
      fetchChallenges,
      createChallenge,
      updateChallenge,
      deleteChallenge,
      getChallengeById,
    }),
    [
      challenges,
      isLoading,
      error,
      fetchChallenges,
      createChallenge,
      updateChallenge,
      deleteChallenge,
      getChallengeById,
    ]
  );

  return returnValue;
};
