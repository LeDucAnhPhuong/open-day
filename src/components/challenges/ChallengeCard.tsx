"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Challenge, ChallengeLevel, UserRole } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit?: (challenge: Challenge) => void;
  onDelete?: (challengeId: string) => void;
  onView?: (challenge: Challenge) => void;
  isLoading?: boolean;
}

const getLevelColor = (level: ChallengeLevel) => {
  switch (level) {
    case ChallengeLevel.EASY:
      return "bg-green-500";
    case ChallengeLevel.MEDIUM:
      return "bg-yellow-500";
    case ChallengeLevel.HARD:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export function ChallengeCard({
  challenge,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ChallengeCardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative">
        <div
          className={`absolute top-2 left-2 w-3 h-3 rounded-full ${getLevelColor(
            challenge.level
          )}`}
        />
        <Image
          src={`http://localhost:4000${challenge.image}`}
          alt={`Challenge ${challenge._id}`}
          className="w-full h-48 object-cover"
          width={400}
          height={300}
        />
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <p className="text-xs text-muted-foreground">
            ID: {challenge._id.slice(0, 8)}...
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(challenge)}
            disabled={isLoading}
          >
            View
          </Button>

          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(challenge)}
                disabled={isLoading}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete?.(challenge._id)}
                disabled={isLoading}
              >
                Delete
              </Button>
            </>
          )}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          <p>Created: {new Date(challenge.createdAt).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
