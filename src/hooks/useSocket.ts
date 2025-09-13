"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import io from "socket.io-client";
import { ChatMessage, BattleUpdate, BattleResult } from "@/types/api";
import { Socket as Soc } from "socket.io-client";
import { useCookies } from "react-cookie";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "wss://api.kul-local.me";

interface SocketState {
  isConnected: boolean;
  error: string | null;
}

type Socket = typeof Soc;

export interface UseSocketReturn extends SocketState {
  socket: Socket | null;
  sendChatMessage: (message: string, eventCode: string) => void;
  startBattle: (eventId: string, point: number, time?: string) => void;
  updateBattle: (eventId: string, point: number, time?: string) => void;
  endBattleStage: (eventId: string) => void;
  onChatMessage: (callback: (data: ChatMessage) => void) => void;
  onBattleCreate: (callback: (data: BattleUpdate) => void) => void;
  onBattleResult: (callback: (data: BattleResult) => void) => void;
  onBattleMyResult: (
    callback: (data: { point: number; time: Date }) => void
  ) => void;
  onBattleSubmit: (callback: () => void) => void;
  onUserJoined: (
    callback: (data: { studentId: string; currentPlayers: string[] }) => void
  ) => void;
  onYouAreDead: (callback: () => void) => void;
  onSystemMessage: (
    callback: (data: { msg: string; [key: string]: any }) => void
  ) => void;
  disconnect: () => void;
}

export const useSocket = (
  token: string | null,
  autoConnect: boolean = false
): UseSocketReturn => {
  const [state, setState] = useState<SocketState>({
    isConnected: false,
    error: null,
  });

  const [cookies] = useCookies(["event_token"], { doNotParse: true });

  const socketRef = useRef<Socket | null>(null);
  const eventListenersRef = useRef<Map<string, any[]>>(new Map());

  // Connect to socket
  const connect = useCallback(() => {
    if (!token) {
      setState((prev) => ({
        ...prev,
        error: "No authentication token provided",
      }));
      return;
    }

    if (socketRef.current?.connected) {
      return;
    }

    try {
      const socket = io(`${SOCKET_URL}/ws/event`, {
        auth: { token: cookies.event_token },
        transports: ["websocket", "polling"],
      });

      socket.on("connect", () => {
        setState({ isConnected: true, error: null });
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", (reason: any) => {
        setState({ isConnected: false, error: `Disconnected: ${reason}` });
        console.log("Socket disconnected:", reason);
      });

      socket.on("connect_error", (error: any) => {
        setState((prev) => ({ ...prev, error: error.message }));
        console.error("Socket connection error:", error);
      });

      socketRef.current = socket;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect";
      setState((prev) => ({ ...prev, error: errorMessage }));
    }
  }, [token]);

  // Disconnect from socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({ isConnected: false, error: null });
      eventListenersRef.current.clear();
    }
  }, []);

  // Auto connect/disconnect based on token and autoConnect flag
  useEffect(() => {
    if (autoConnect && token && connect) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [token, autoConnect, connect, disconnect]);

  // Socket event emitters
  const sendChatMessage = useCallback((message: string, eventCode: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("chat:send", { msg: message, eventCode });
    }
  }, []);

  const startBattle = useCallback(
    (eventId: string, point: number, time?: string) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("battle:action", { eventId, point, time });
      }
    },
    []
  );

  const updateBattle = useCallback(
    (eventId: string, point: number, time?: string) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("battle:update", { eventId, point, time });
      }
    },
    []
  );

  const endBattleStage = useCallback((eventId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("battle:end_stage", { eventId });
    }
  }, []);

  // Socket event listeners setup functions
  const onChatMessage = useCallback((callback: (data: ChatMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.on("chat:new", callback);

      // Store listener reference for cleanup
      const listeners = eventListenersRef.current.get("chat:new") || [];
      listeners.push(callback);
      eventListenersRef.current.set("chat:new", listeners);
    }
  }, []);

  const onBattleCreate = useCallback(
    (callback: (data: BattleUpdate) => void) => {
      if (socketRef.current) {
        socketRef.current.on("battle:create", callback);

        const listeners = eventListenersRef.current.get("battle:create") || [];
        listeners.push(callback);
        eventListenersRef.current.set("battle:create", listeners);
      }
    },
    []
  );

  const onBattleResult = useCallback(
    (callback: (data: BattleResult) => void) => {
      if (socketRef.current) {
        socketRef.current.on("battle:result", callback);

        const listeners = eventListenersRef.current.get("battle:result") || [];
        listeners.push(callback);
        eventListenersRef.current.set("battle:result", listeners);
      }
    },
    []
  );

  const onBattleMyResult = useCallback(
    (callback: (data: { point: number; time: Date }) => void) => {
      if (socketRef.current) {
        socketRef.current.on("battle:my-result", callback);

        const listeners =
          eventListenersRef.current.get("battle:my-result") || [];
        listeners.push(callback);
        eventListenersRef.current.set("battle:my-result", listeners);
      }
    },
    []
  );

  const onBattleSubmit = useCallback((callback: () => void) => {
    if (socketRef.current) {
      socketRef.current.on("battle:submit", callback);

      const listeners = eventListenersRef.current.get("battle:submit") || [];
      listeners.push(callback);
      eventListenersRef.current.set("battle:submit", listeners);
    }
  }, []);

  const onUserJoined = useCallback(
    (
      callback: (data: { studentId: string; currentPlayers: string[] }) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.on("system", (data: any) => {
          console.log("user-joined-1", data);
          if (data.msg === "user-joined") {
            callback(data);
          }
        });
        const listeners = eventListenersRef.current.get("system") || [];
        listeners.push(callback);
        eventListenersRef.current.set("system", listeners);
      }
    },
    []
  );

  const onYouAreDead = useCallback((callback: () => void) => {
    if (socketRef.current) {
      socketRef.current.on("battle:you-are-dead", callback);

      const listeners =
        eventListenersRef.current.get("battle:you-are-dead") || [];
      listeners.push(callback);
      eventListenersRef.current.set("battle:you-are-dead", listeners);
    }
  }, []);

  const onSystemMessage = useCallback(
    (callback: (data: { msg: string; [key: string]: any }) => void) => {
      if (socketRef.current) {
        socketRef.current.on("system", callback);

        const listeners = eventListenersRef.current.get("system") || [];
        listeners.push(callback);
        eventListenersRef.current.set("system", listeners);
      }
    },
    []
  );

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      eventListenersRef.current.forEach((listeners, event) => {
        listeners.forEach((listener) => {
          if (socketRef.current) {
            socketRef.current.off(event, listener as any);
          }
        });
      });
      eventListenersRef.current.clear();
    };
  }, [state?.isConnected, socketRef.current]);

  const currentValue = useMemo(
    () => ({
      ...state,
      socket: socketRef.current,
      sendChatMessage,
      startBattle,
      updateBattle,
      endBattleStage,
      onChatMessage,
      onBattleCreate,
      onBattleResult,
      onBattleMyResult,
      onBattleSubmit,
      onUserJoined,
      onYouAreDead,
      onSystemMessage,
      disconnect,
    }),
    [state.isConnected]
  );

  return currentValue;
};
