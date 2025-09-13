"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";
import { useSocketBattle } from "@/app/(css-game)/battle/[eventCode]/provider";

interface ChatBoxProps {
  eventCode: string;
}

export function ChatBox({ eventCode }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isConnected, sendChatMessage, onChatMessage, onSystemMessage } =
    useSocketBattle();

  console.log("isConnected", isConnected);

  useEffect(() => {
    if (!isConnected) return;

    // Listen for new chat messages
    onChatMessage((message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });
    onSystemMessage((data) => {
      if (data?.msg !== "user-joined") return;
      const systemMessage: ChatMessage = {
        eventCode,
        studentId: "system",
        msg: `User ${data.studentId}... joined the battle`,
        createdAt: new Date(),
      };
      const alreadyExists = messages.find(
        (msg) => msg.msg === systemMessage.msg
      );
      if (!alreadyExists) setMessages((prev) => [...prev, systemMessage]);
    });
  }, [isConnected]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    sendChatMessage(newMessage.trim(), eventCode);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isSystemMessage = (studentId: string) => studentId === "system";
  const isOwnMessage = (studentId: string) => studentId === user?.studentId;

  return (
    <Card className="h-96 flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700">
      <CardHeader className="pb-2 bg-slate-800/50 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            💬 Battle Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-500" : "bg-red-500"
              } animate-pulse`}
            />
            <span className="text-xs text-slate-300">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-3 max-h-[200px] h-[200px]">
          <div className="space-y-2">
            {messages?.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-400 text-sm">
                  <div className="text-2xl mb-2">👋</div>
                  <p>Chat is ready!</p>
                  <p className="text-xs">Say hello to other players</p>
                </div>
              </div>
            ) : (
              messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    isOwnMessage(message.studentId)
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {isSystemMessage(message.studentId) ? (
                    // System messages
                    <div className="w-full text-center py-1">
                      <div className="inline-block bg-yellow-500/20 text-yellow-200 text-xs px-3 py-1 rounded-full border border-yellow-500/30">
                        ⚡ {message.msg}
                      </div>
                    </div>
                  ) : (
                    // User messages
                    <div
                      className={`max-w-[75%] ${
                        isOwnMessage(message.studentId) ? "ml-4" : "mr-4"
                      }`}
                    >
                      {!isOwnMessage(message.studentId) && (
                        <div className="text-xs text-slate-400 mb-1 px-2">
                          Player {message.studentId}
                        </div>
                      )}
                      <div
                        className={`px-3 py-2 rounded-lg text-sm relative ${
                          isOwnMessage(message.studentId)
                            ? "bg-blue-600 text-white ml-auto"
                            : "bg-slate-700 text-slate-100 border border-slate-600"
                        }`}
                      >
                        <div>{message.msg}</div>
                        <div
                          className={`text-xs mt-1 opacity-70 ${
                            isOwnMessage(message.studentId)
                              ? "text-blue-200"
                              : "text-slate-400"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </div>

                        {/* Message tail */}
                        <div
                          className={`absolute top-3 w-0 h-0 ${
                            isOwnMessage(message.studentId)
                              ? "right-[-6px] border-l-[6px] border-l-blue-600 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent"
                              : "left-[-6px] border-r-[6px] border-r-slate-700 border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-slate-700 bg-slate-800/50 p-3">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              disabled={!isConnected}
              maxLength={500}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <Button
              type="submit"
              disabled={!isConnected || !newMessage.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            >
              Send
            </Button>
          </form>

          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>Press Enter to send</span>
            <span>{newMessage?.length}/500</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
