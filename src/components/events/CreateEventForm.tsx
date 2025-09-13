"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateEventDto } from "@/types/api";

const eventSchema = z
  .object({
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type EventFormData = z.infer<typeof eventSchema>;

interface CreateEventFormProps {
  onSubmit: (data: CreateEventDto) => Promise<void>;
  isLoading?: boolean;
}

export function CreateEventForm({
  onSubmit,
  isLoading = false,
}: CreateEventFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16), // 2 hours from now
    },
  });

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      setError(null);
      const submitData: CreateEventDto = {
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      };
      await onSubmit(submitData);
      reset();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create event";
      setError(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
        <CardDescription>
          Set up a new CSS Battle event with start and end times
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              {...register("startTime")}
              disabled={isLoading}
            />
            {errors.startTime && (
              <p className="text-sm text-destructive">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              {...register("endTime")}
              disabled={isLoading}
            />
            {errors.endTime && (
              <p className="text-sm text-destructive">
                {errors.endTime.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Event..." : "Create Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
