"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/api";
import { useSocketBattle } from "@/app/(css-game)/battle/[eventCode]/provider";

interface Player {
  studentId: string;
  name?: string;
  avatar?: string;
  hp: number;
  isLive: boolean;
  isReady: boolean;
}

interface BattleLobbyProps {
  eventId: string;
  eventCode: string;
  onBattleStart: () => void;
}

export function BattleLobby({
  eventId,
  eventCode,
  onBattleStart,
}: BattleLobbyProps) {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [countdownTime, setCountdownTime] = useState<number | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  const {
    isConnected,
    error: socketError,
    startBattle,
    onSystemMessage,
    onUserJoined,
    onBattleCreate,
  } = useSocketBattle();

  useEffect(() => {
    if (!isConnected) return;

    // Listen for users joining
    onUserJoined((data) => {
      setPlayers((prev) => {
        if (prev.find((p) => p.studentId === data.studentId)) {
          return prev;
        }
        return [
          ...prev,
          {
            studentId: data?.studentId,
            name: `${data?.studentId}`,
            hp: 10,
            isLive: true,
            isReady: false,
          },
        ];
      });
    });

    // Listen for battle start
    onBattleCreate(() => {
      onBattleStart();
    });

    // Listen for system messages
    onSystemMessage((data) => {
      if (data.msg === "battle-starting") {
        setIsStarting(true);
        setCountdownTime(5);

        // Countdown timer
        const countdown = setInterval(() => {
          setCountdownTime((prev) => {
            if (prev === null || prev <= 1) {
              clearInterval(countdown);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        if (data?.msg === "async-user-joined") {
          setPlayers((prev) => {
            const currentPlayers = data?.currentPlayers || [];

            const playersToAdd = currentPlayers?.filter((id: string) => {
              return !prev.find((p) => p.studentId === id);
            });
            if (playersToAdd.length === 0) return prev;

            const newData = playersToAdd.map((studentId: string) => ({
              studentId,
              name: `${studentId}`,
              hp: 10,
              isLive: true,
              isReady: false,
            }));

            return [...prev, ...newData];
          });
        }
      }
    });
  }, [
    isConnected,
    onBattleCreate,
    onSystemMessage,
    onBattleStart,
    onUserJoined,
  ]);

  const handleStartBattle = () => {
    if (isAdmin && players?.length >= 2) {
      startBattle(eventId, 0);
      setIsStarting(true);
    }
  };

  const handleToggleReady = () => {
    // This would emit a ready status change
    // For now, just toggle locally
    setPlayers((prev) =>
      prev.map((p) =>
        p.studentId === user?._id ? { ...p, isReady: !p.isReady } : p
      )
    );
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              {socketError || "Connecting to battle lobby..."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lobby Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Battle Lobby</CardTitle>
              <p className="text-muted-foreground">Event Code: {eventCode}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {players?.length} Players
              </Badge>
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Battle Starting Countdown */}
      {isStarting && countdownTime !== null && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-yellow-800">
                Battle Starting in {countdownTime}...
              </h3>
              <Progress
                value={(5 - countdownTime) * 20}
                className="w-full h-4"
              />
              <p className="text-yellow-700">Get ready to battle!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Players Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Players ({players?.length}/8)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Current players */}
            {players?.map((player) => (
              <div
                key={player.studentId}
                className={`p-4 rounded-lg border-2 transition-all ${
                  player.isReady
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback className="text-lg">
                      {player.name?.charAt(0) ||
                        player.studentId.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <p className="font-semibold text-sm">{player.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {player.studentId}...
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={player.hp > 5 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {player.hp} HP
                    </Badge>
                    {player.isReady && (
                      <Badge variant="default" className="text-xs bg-green-500">
                        Ready
                      </Badge>
                    )}
                  </div>

                  <div
                    className={`w-3 h-3 rounded-full ${
                      player.isLive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 8 - players?.length) }).map(
              (_, index) => (
                <div
                  key={`empty-${index}`}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
                >
                  <div className="flex flex-col items-center space-y-2 opacity-50">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-muted-foreground">
                      Waiting for player...
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Battle Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdmin ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Host Controls</h4>
                  <p className="text-sm text-muted-foreground">
                    As the host, you can start the battle when ready.
                  </p>
                </div>
                <Button
                  onClick={handleStartBattle}
                  disabled={players?.length < 2 || isStarting}
                  size="lg"
                  className="px-8"
                >
                  {isStarting ? "Starting..." : "Start Battle"}
                </Button>
              </div>

              {players?.length < 2 && (
                <Alert>
                  <AlertDescription>
                    Need at least 2 players to start the battle.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Player Controls</h4>
                  <p className="text-sm text-muted-foreground">
                    Mark yourself as ready when you&apos;re prepared to battle.
                  </p>
                </div>
                <Button
                  onClick={handleToggleReady}
                  variant={
                    players?.find((p) => p.studentId === user?._id)?.isReady
                      ? "default"
                      : "outline"
                  }
                  size="lg"
                  className="px-8"
                >
                  {players?.find((p) => p.studentId === user?._id)?.isReady
                    ? "Ready!"
                    : "Mark Ready"}
                </Button>
              </div>

              <Alert>
                <AlertDescription>
                  Waiting for the host to start the battle...
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Battle Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Battle Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold mb-2">🎯 How to Play:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Match the target image with CSS</li>
                <li>• Submit your solution within time limit</li>
                <li>• Higher accuracy = more points</li>
                <li>• Survive multiple rounds to win</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">💖 HP System:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Start with 10 HP</li>
                <li>• Lose HP for poor performance</li>
                <li>• 0 HP = Elimination</li>
                <li>• Last player standing wins</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
