"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Challenge, BattleUpdate, BattleResult, UserRole } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";
import { BattleLobby } from "./BattleLobby";
import { CSSBattleGame } from "./CSSBattleGame";
import { useSocketBattle } from "@/app/(css-game)/battle/[eventCode]/provider";

export interface BattleArenaProps {
  eventId: string;
  eventCode: string;
  battleState: BattleState;
  setBattleState: (state: BattleState) => void;
}

export type BattleState = "lobby" | "battle" | "finished";

export function BattleArena({
  eventId,
  eventCode,
  battleState,
  setBattleState,
}: BattleArenaProps) {
  const { user } = useAuth();

  const isAdmin = user?.role === UserRole.ADMIN;
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );

  const [currentStage, setCurrentStage] = useState<number>(0);
  const [battleResults, setBattleResults] = useState<BattleResult[]>([]);
  const [isSubmitTime, setIsSubmitTime] = useState(false);
  const [userHp, setUserHp] = useState(10);
  const [isDead, setIsDead] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const {
    isConnected,
    error: socketError,
    updateBattle,
    endBattleStage,
    onBattleCreate,
    onBattleResult,
    onBattleMyResult,
    onBattleSubmit,
    onYouAreDead,
    onSystemMessage,
  } = useSocketBattle();

  useEffect(() => {
    if (!isConnected) return;

    // Listen for battle creation
    onBattleCreate((data: BattleUpdate) => {
      setBattleState("battle");
      setCurrentStage(data.stage);

      if (data.challenge) {
        // Stage 1: Everyone gets the same challenge
        setCurrentChallenge(data.challenge);

        // Start 5-minute timer
        setTimeRemaining(300);
        const interval = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              setIsSubmitTime(true);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setTimerInterval(interval);
      }
    });

    // Listen for battle results
    onBattleResult((data: BattleResult) => {
      setBattleResults((prev) => {
        const existing = prev.find((r) => r.studentId === data.studentId);
        if (existing) {
          return prev.map((r) => (r.studentId === data.studentId ? data : r));
        }
        return [...prev, data];
      });

      if (data.studentId === user?.studentId) {
        setUserHp(data.hp);
      }
    });

    // Listen for battle submit time
    onBattleSubmit(() => {
      setIsSubmitTime(true);
      // Clear timer when submit time is reached
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setTimeRemaining(0);
      // Auto-hide submit notification after 5 seconds
      setTimeout(() => setIsSubmitTime(false), 5000);
    });

    // Listen for personal battle result
    onBattleMyResult((data) => {
      // Update user's personal score display or show notification
      console.log("My result:", data);
      // You can add a toast notification here
    });

    // Listen for death notification
    onYouAreDead(() => {
      setIsDead(true);
    });

    // Listen for system messages
    onSystemMessage((data) => {
      console.log("System message:", data);
    });
  }, [
    isConnected,
    onBattleCreate,
    onBattleResult,
    onBattleMyResult,
    onBattleSubmit,
    onYouAreDead,
    onSystemMessage,
    user?._id,
  ]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const handleBattleStart = () => {
    setBattleState("battle");
  };

  const handleSubmitSolution = (points: number) => {
    updateBattle(eventId, points);
  };

  const handleEndStage = () => {
    endBattleStage(eventId);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              {socketError || "Connecting to battle arena..."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isDead) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription className="text-center text-lg">
              💀 You have been eliminated from the battle! 💀
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Battle Status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Battle Arena</CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline">Stage {currentStage}</Badge>
              <Badge variant={userHp > 5 ? "default" : "destructive"}>
                HP: {userHp}
              </Badge>
              <Badge variant="secondary">Event: {eventCode}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Submit Time Alert */}
      {isSubmitTime && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertDescription className="text-center font-bold">
            ⏰ Time&apos;s up! Submit your solution now!
          </AlertDescription>
        </Alert>
      )}

      {/* Battle State Handler */}
      {battleState === "lobby" ? (
        <BattleLobby
          eventId={eventId}
          eventCode={eventCode}
          onBattleStart={handleBattleStart}
        />
      ) : battleState === "battle" && currentChallenge && !isAdmin ? (
        <CSSBattleGame
          challenge={currentChallenge}
          onSubmit={handleSubmitSolution}
          timeRemaining={timeRemaining}
          isSubmitTime={isSubmitTime}
        />
      ) : battleState === "battle" && !currentChallenge ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Waiting for next challenge...
              </p>
              <div className="animate-pulse">⏳</div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Admin Controls */}
      {battleState === "battle" && isAdmin && currentStage > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Host Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEndStage} variant="destructive">
              End Current Stage
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Battle Results - Only visible to host */}
      {battleState === "battle" && battleResults?.length > 0 && isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Live Results</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    window.open(`/battle/${eventCode}/result`, "_blank")
                  }
                  variant="outline"
                  size="sm"
                >
                  Event Results
                </Button>
                <Button
                  onClick={() => window.open(`/battle/admin/results`, "_blank")}
                  variant="default"
                  size="sm"
                >
                  Global Results
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {battleResults
                .sort((a, b) => b.point - a.point)
                .slice(0, 5) // Only show top 5 in preview
                .map((result, index) => (
                  <div
                    key={result.studentId}
                    className="flex justify-between items-center p-2 rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span>User {result.studentId.slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{result.point} pts</Badge>
                      <Badge
                        variant={result.hp > 5 ? "default" : "destructive"}
                      >
                        {result.hp} HP
                      </Badge>
                    </div>
                  </div>
                ))}
              {battleResults.length > 5 && (
                <div className="text-center text-sm text-muted-foreground pt-2">
                  And {battleResults.length - 5} more players...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player's own result display */}
      {battleState === "battle" && !isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Your Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                {battleResults.find((r) => r.studentId === user?.studentId)
                  ?.point || 0}
                %
              </div>
              <div className="text-muted-foreground">Your Best Score</div>
              <Badge
                variant={userHp > 5 ? "default" : "destructive"}
                className="mt-2"
              >
                {userHp} HP Remaining
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
