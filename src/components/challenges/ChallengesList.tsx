"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChallengeCard } from "./ChallengeCard";
import { Challenge, ChallengeLevel, UserRole } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";
import { useChallenges } from "@/hooks/useChallenges";

interface ChallengesListProps {
  onCreateNew?: () => void;
  onEditChallenge?: (challenge: Challenge) => void;
  onViewChallenge?: (challenge: Challenge) => void;
}

export function ChallengesList({
  onCreateNew,
  onEditChallenge,
  onViewChallenge,
}: ChallengesListProps) {
  const { token, user } = useAuth();
  const { challenges, isLoading, error, fetchChallenges, deleteChallenge } =
    useChallenges(token);

  const [selectedLevel, setSelectedLevel] = useState<ChallengeLevel | "all">(
    "all"
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  const handleLevelFilter = (level: ChallengeLevel | "all") => {
    setSelectedLevel(level);
    if (level === "all") {
      fetchChallenges();
    } else {
      fetchChallenges(level);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;

    try {
      setIsDeleting(challengeId);
      await deleteChallenge(challengeId);
    } catch (err) {
      console.error("Failed to delete challenge:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Challenges</h2>
          <Badge variant="secondary">
            {challenges?.length} challenge
            {challenges?.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedLevel} onValueChange={handleLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value={ChallengeLevel.EASY}>Easy</SelectItem>
              <SelectItem value={ChallengeLevel.MEDIUM}>Medium</SelectItem>
              <SelectItem value={ChallengeLevel.HARD}>Hard</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Button onClick={onCreateNew} disabled={isLoading}>
              Create New Challenge
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive text-sm">Error: {error}</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-full max-w-sm">
              <div className="animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-20 rounded" />
                  <div className="bg-muted h-3 w-full rounded" />
                  <div className="flex gap-2">
                    <div className="bg-muted h-8 w-16 rounded" />
                    <div className="bg-muted h-8 w-16 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && challenges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {selectedLevel === "all"
              ? "No challenges found"
              : `No ${selectedLevel} challenges found`}
          </div>
          {isAdmin && (
            <Button onClick={onCreateNew}>Create First Challenge</Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            onEdit={onEditChallenge}
            onDelete={handleDeleteChallenge}
            onView={onViewChallenge}
            isLoading={isDeleting === challenge._id}
          />
        ))}
      </div>
    </div>
  );
}
