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
import { JoinEventDto } from "@/types/api";

const joinEventSchema = z.object({
  code: z
    .string()
    .min(1, "Event code is required")
    .length(6, "Event code must be 6 characters"),
});

type JoinEventFormData = z.infer<typeof joinEventSchema>;

interface JoinEventFormProps {
  onSubmit: (data: JoinEventDto) => Promise<void>;
  isLoading?: boolean;
}

export function JoinEventForm({
  onSubmit,
  isLoading = false,
}: JoinEventFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JoinEventFormData>({
    resolver: zodResolver(joinEventSchema),
  });

  const handleFormSubmit = async (data: JoinEventFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      reset();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to join event";
      setError(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Join Event</CardTitle>
        <CardDescription>
          Enter the event code to join a CSS Battle event
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
            <Label htmlFor="eventCode">Event Code</Label>
            <Input
              id="eventCode"
              placeholder="Enter 6-character event code"
              {...register("code")}
              disabled={isLoading}
              className="text-center font-mono text-lg tracking-wider uppercase"
              maxLength={6}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Joining Event..." : "Join Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
