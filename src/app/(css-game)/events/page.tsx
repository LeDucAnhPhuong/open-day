"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout";
import { CreateEventForm, JoinEventForm } from "@/components/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { CreateEventDto, JoinEventDto, UserRole } from "@/types/api";

export default function EventsPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();

  const { createEvent, joinEvent, isLoading, error } = useEvents(token);
  const [success, setSuccess] = useState<string | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  const handleCreateEvent = async (data: CreateEventDto) => {
    try {
      const event = await createEvent(data);
      setSuccess(`Event created successfully! Event code: ${event?.code}`);
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const handleJoinEvent = async (data: JoinEventDto) => {
    try {
      await joinEvent(data);
      setSuccess(`Successfully joined event: ${data?.code}`);
      // Redirect to battle arena
      router.push(`/battle/${data?.code}`);
    } catch (err) {
      console.error("Failed to join event:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <Alert>
                <AlertDescription>
                  Please login to access events and battle arena.
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">CSS Battle Events</h1>
            <p className="text-muted-foreground">
              Create or join real-time CSS Battle events
            </p>
          </div>

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="join" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="join">Join Event</TabsTrigger>
              <TabsTrigger value="create" disabled={!isAdmin}>
                {isAdmin ? "Create Event" : "Create Event (Admin Only)"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="join" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Join an Existing Event</CardTitle>
                  <CardDescription>
                    Enter the event code provided by the event host
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <JoinEventForm
                    onSubmit={handleJoinEvent}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              {isAdmin ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>
                      Set up a new CSS Battle event for participants
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <CreateEventForm
                      onSubmit={handleCreateEvent}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <AlertDescription>
                    Only administrators can create events. Please contact an
                    admin to create new events.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How CSS Battle Events Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">For Participants:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Join events using a 6-character code</li>
                    <li>• Compete in real-time CSS challenges</li>
                    <li>• Earn points based on accuracy</li>
                    <li>• Chat with other participants</li>
                    <li>• Survive multiple rounds to win</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Hosts (Admin):</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Create events with custom time slots</li>
                    <li>• Start battles and manage rounds</li>
                    <li>• Monitor participant progress</li>
                    <li>• Control event flow and timing</li>
                    <li>• End stages to eliminate players</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
