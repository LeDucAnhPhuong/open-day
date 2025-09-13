"use client";

import { use, useState } from "react";
import { Navigation } from "@/components/layout";
import { BattleArena, ChatBox } from "@/components/battle";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { BattleState } from "@/components/battle/BattleArena";
import { cn } from "@/utils/cn";

interface BattlePageProps {
  params: Promise<{ eventCode: string }>;
}

export default function BattlePage({ params }: BattlePageProps) {
  const { eventCode } = use(params);
  const { isAuthenticated } = useAuth();

  const [battleState, setBattleState] = useState<BattleState>("lobby");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <Alert>
                <AlertDescription>
                  Please login to join the battle arena.
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
      <div className="mx-auto px-4 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Battle Arena - Main content area */}
          <div
            className={cn(
              battleState === "battle" ? "xl:col-span-4" : "xl:col-span-3"
            )}
          >
            <BattleArena
              eventId="temp-event-id" // This would normally come from API
              eventCode={eventCode}
              battleState={battleState}
              setBattleState={setBattleState}
            />
          </div>

          {battleState !== "battle" && (
            <div className="xl:col-span-1">
              <div className="sticky top-4">
                <ChatBox eventCode={eventCode} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
