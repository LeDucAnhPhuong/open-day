"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { useSocket, UseSocketReturn } from "@/hooks/useSocket";
import React, { useContext } from "react";

const socketContext = React.createContext<UseSocketReturn>({
  isConnected: false,
  error: null,
  socket: null,
  sendChatMessage: () => {},
  startBattle: () => {},
  updateBattle: () => {},
  endBattleStage: () => {},
  onChatMessage: () => {},
  onBattleCreate: () => {},
  onBattleResult: () => {},
  onBattleMyResult: () => {},
  onBattleSubmit: () => {},
  onYouAreDead: () => {},
  onSystemMessage: () => {},
  disconnect: () => {},
  onUserJoined: () => {},
});

export const useSocketBattle = () => {
  return useContext(socketContext);
};

const BattleProvider = ({ children }: { children: React.ReactNode }) => {
  const { token: user_token } = useAuth();

  const { token } = useEvents(user_token || "");

  const socket = useSocket(token, true);

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
};

export default BattleProvider;
