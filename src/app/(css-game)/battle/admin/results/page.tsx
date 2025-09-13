"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Trophy, Medal, Award, Users, Search, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { BattleResult, UserRole } from "@/types/api";
import io from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:4000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminResultsPage() {
  const { user, token } = useAuth();
  const [allBattleResults, setAllBattleResults] = useState<BattleResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<BattleResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByEvent, setFilterByEvent] = useState("all");
  const [sortBy, setSortBy] = useState("points");
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  // Check if user is admin
  const isAdmin = user?.role === UserRole.ADMIN;

  // Fetch initial battle results from API
  const fetchInitialResults = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/events/result`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform backend data to match frontend BattleResult interface
      const transformedResults: BattleResult[] = data.map((battle: any) => ({
        studentId: battle.studentId,
        eventCode: battle.eventCode,
        point: battle.point,
        hp: battle.hp || 10,
        time: battle.time,
      }));

      setAllBattleResults(transformedResults);
      setLastFetchTime(new Date());
    } catch (err) {
      console.error("Error fetching battle results:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch results");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    // Fetch initial data
    fetchInitialResults();

    // Connect to socket to listen for all battle results
    const socketInstance = io(`${SOCKET_URL}/ws/event`, {
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Admin results socket connected");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for battle results from all events
    socketInstance.on("battle:result", (data: BattleResult) => {
      setAllBattleResults((prev) => {
        const existing = prev.find(
          (r) =>
            r.studentId === data.studentId && r.eventCode === data.eventCode
        );
        if (existing) {
          return prev.map((r) =>
            r.studentId === data.studentId && r.eventCode === data.eventCode
              ? data
              : r
          );
        }
        return [...prev, data];
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAdmin]);

  // Filter and sort results
  useEffect(() => {
    let filtered = [...allBattleResults];

    // Filter by search term (student ID or event code)
    if (searchTerm) {
      filtered = filtered.filter(
        (result) =>
          result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.eventCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by event
    if (filterByEvent !== "all") {
      filtered = filtered.filter(
        (result) => result.eventCode === filterByEvent
      );
    }

    // Sort results
    switch (sortBy) {
      case "points":
        filtered.sort((a, b) => b.point - a.point);
        break;
      case "time":
        filtered.sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );
        break;
      case "event":
        filtered.sort((a, b) => a.eventCode.localeCompare(b.eventCode));
        break;
      case "student":
        filtered.sort((a, b) => a.studentId.localeCompare(b.studentId));
        break;
    }

    setFilteredResults(filtered);
  }, [allBattleResults, searchTerm, filterByEvent, sortBy]);

  // Get unique event codes for filter dropdown
  const uniqueEventCodes = Array.from(
    new Set(allBattleResults.map((result) => result.eventCode))
  );

  // Calculate statistics
  const totalParticipants = new Set(allBattleResults.map((r) => r.studentId))
    .size;
  const totalEvents = uniqueEventCodes.length;
  const averageScore =
    allBattleResults.length > 0
      ? allBattleResults.reduce((sum, r) => sum + r.point, 0) /
        allBattleResults.length
      : 0;
  const highestScore =
    allBattleResults.length > 0
      ? Math.max(...allBattleResults.map((r) => r.point))
      : 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">
            #{rank}
          </span>
        );
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Access denied. Only administrators can view global results.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Loading battle results...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading results: {error}
                </AlertDescription>
              </Alert>
              <Button
                onClick={fetchInitialResults}
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Global Battle Results</h1>
              <p className="text-muted-foreground">
                Administrator view - All events
                {lastFetchTime && (
                  <span className="ml-2 text-xs">
                    (Last updated: {lastFetchTime.toLocaleTimeString()})
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {totalParticipants} Total Players
              </Badge>
              <Badge variant="secondary">{totalEvents} Events</Badge>
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="flex items-center gap-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {isConnected ? "Live" : "Disconnected"}
              </Badge>
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
              <div className="text-2xl font-bold">
                {allBattleResults.length}
              </div>
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
                {averageScore.toFixed(1)}%
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
              <div className="text-2xl font-bold">{highestScore}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Active Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search student ID or event code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <select
                value={filterByEvent}
                onChange={(e) => setFilterByEvent(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Events</option>
                {uniqueEventCodes.map((eventCode) => (
                  <option key={eventCode} value={eventCode}>
                    {eventCode}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="points">Highest Points</option>
                <option value="time">Latest Submission</option>
                <option value="event">Event Code</option>
                <option value="student">Student ID</option>
              </select>

              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilterByEvent("all");
                  setSortBy("points");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Global Leaderboard ({filteredResults.length} results)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No results found</p>
                <p className="text-sm">
                  {allBattleResults.length === 0
                    ? "Battle results will appear here as players submit solutions."
                    : "Try adjusting your filters to see more results."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredResults.map((result, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={`${result.studentId}-${result.eventCode}-${result.time}`}
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
                            {result.studentId?.slice(0, 12)}...
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Event: {result.eventCode} •{" "}
                            {new Date(result?.time).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {result.point}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            accuracy
                          </div>
                        </div>

                        <Badge
                          variant={result.hp > 5 ? "default" : "destructive"}
                          className="min-w-[60px]"
                        >
                          {result.hp} HP
                        </Badge>

                        <Badge variant="outline" className="min-w-[80px]">
                          {result.eventCode}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <Button
            onClick={fetchInitialResults}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Refreshing...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>

          <Button
            onClick={() => {
              const csv = [
                [
                  "Rank",
                  "Student ID",
                  "Event Code",
                  "Score (%)",
                  "HP",
                  "Submission Time",
                ],
                ...filteredResults.map((result, index) => [
                  index + 1,
                  result.studentId,
                  result.eventCode,
                  result.point,
                  result.hp,
                  new Date(result.time).toISOString(),
                ]),
              ]
                .map((row) => row.join(","))
                .join("\n");

              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `battle-results-${
                new Date().toISOString().split("T")[0]
              }.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            variant="default"
          >
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
