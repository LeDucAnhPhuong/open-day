"use client";

import { use, useState, useEffect } from "react";
import { Navigation } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Medal, Award, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { BattleResult, UserRole } from "@/types/api";
import { useSocketBattle } from "../provider";

interface ResultPageProps {
  params: Promise<{ eventCode: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const { eventCode } = use(params);
  const { user } = useAuth();
  const [battleResults, setBattleResults] = useState<BattleResult[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const {
    isConnected,
    error: socketError,
    onBattleResult,
    onSystemMessage,
  } = useSocketBattle();

  // Check if user is host
  const isHost = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (!isConnected || !isHost) return;

    // Listen for battle results to build leaderboard
    onBattleResult((data: BattleResult) => {
      setBattleResults((prev) => {
        const existing = prev.find((r) => r.studentId === data.studentId);
        if (existing) {
          return prev.map((r) => (r.studentId === data.studentId ? data : r));
        }
        return [...prev, data];
      });
    });

    // Listen for system messages to track player count
    onSystemMessage((data) => {
      if (data.msg === "async-user-joined" && data.currentPlayers) {
        setTotalPlayers(data.currentPlayers.length);
      }
    });
  }, [isConnected, isHost, onBattleResult, onSystemMessage]);

  const sortedResults = battleResults
    .filter((result) => result.point > 0) // Only show players with scores
    .sort((a, b) => {
      // Sort by points (descending), then by submission time (ascending)
      if (b.point !== a.point) {
        return b.point - a.point;
      }
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-lg font-bold">
            #{rank}
          </span>
        );
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default"; // Gold
      case 2:
        return "secondary"; // Silver
      case 3:
        return "outline"; // Bronze
      default:
        return "outline";
    }
  };

  if (!user || !isHost) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Access denied. Only hosts can view the results page.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  {socketError || "Connecting to battle results..."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Battle Results</h1>
              <p className="text-muted-foreground">Event: {eventCode}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {totalPlayers} Players
              </Badge>
              <Badge variant="secondary">Stage {currentStage}</Badge>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sortedResults.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sortedResults.length > 0
                  ? (
                      sortedResults.reduce((sum, r) => sum + r.point, 0) /
                      sortedResults.length
                    ).toFixed(1)
                  : "0"}
                %
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Highest Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sortedResults.length > 0 ? sortedResults[0].point : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPlayers > 0
                  ? ((sortedResults.length / totalPlayers) * 100).toFixed(0)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No submissions yet...</p>
                <p className="text-sm">
                  Results will appear here as players submit their solutions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedResults.map((result, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={result.studentId}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        rank <= 3
                          ? "bg-gradient-to-r from-background to-muted/50"
                          : "bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(rank)}
                          <Badge variant={getRankBadgeVariant(rank)}>
                            #{rank}
                          </Badge>
                        </div>

                        <div>
                          <div className="font-medium">
                            Player {result.studentId.slice(0, 8)}...
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Submitted:{" "}
                            {new Date(result.time).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {result.point}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            accuracy
                          </div>
                        </div>

                        <Badge
                          variant={result.hp > 5 ? "default" : "destructive"}
                          className="min-w-[60px]"
                        >
                          {result.hp} HP
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Results
          </Button>

          <Button onClick={() => window.history.back()}>Back to Battle</Button>
        </div>
      </div>
    </div>
  );
}
