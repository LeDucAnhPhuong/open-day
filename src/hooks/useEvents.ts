"use client";

import { useState, useCallback, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import { Event, CreateEventDto, JoinEventDto, MemberEvent } from "@/types/api";
import { useCookies } from "react-cookie";

interface UseEventsReturn {
  isLoading: boolean;
  error: string | null;
  createEvent: (data: CreateEventDto) => Promise<any>;
  joinEvent: (data: JoinEventDto) => Promise<any>;
  getEventMembers: (eventId: string) => Promise<MemberEvent[]>;
  toggleEventStatus: (eventId: string) => Promise<Event>;
  token: string | null;
}

export const useEvents = (token: string | null): UseEventsReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(["event_token"], {
    doNotParse: true,
  });

  const createEvent = useCallback(
    async (data: CreateEventDto) => {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      try {
        setIsLoading(true);
        setError(null);

        const response: any = await apiClient.post("/events", data, token);
        setCookie("event_token", response?.wsToken);
        return response?.event;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create event";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const joinEvent = useCallback(
    async (data: JoinEventDto): Promise<any> => {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      try {
        setIsLoading(true);
        setError(null);

        const response: any = await apiClient.post("/events/join", data, token);
        setCookie("event_token", response?.wsToken);
        return response?.event;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to join event";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const getEventMembers = useCallback(
    async (eventId: string): Promise<MemberEvent[]> => {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get<MemberEvent[]>(
          `/events/${eventId}/members`,
          token
        );
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch event members";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const toggleEventStatus = useCallback(
    async (eventId: string): Promise<Event> => {
      if (!token) {
        throw new Error("No authentication token provided");
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.patch<Event>(
          `/events/${eventId}/toggle-status`,
          {},
          token
        );
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to toggle event status";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const returnValue = useMemo(
    () => ({
      isLoading,
      error,
      createEvent,
      joinEvent,
      getEventMembers,
      toggleEventStatus,
      token: cookies.event_token || null,
    }),
    [
      isLoading,
      error,
      createEvent,
      joinEvent,
      getEventMembers,
      toggleEventStatus,
      cookies,
    ]
  );

  return returnValue;
};
