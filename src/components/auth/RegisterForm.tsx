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
import { useAuth } from "@/hooks/useAuth";
import { RegisterDto } from "@/types/api";

const registerSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .regex(
      /^[a-zA-Z]{2}\d{6}$/,
      "Student ID must be in format: 2 letters + 6 digits (e.g., de180914)"
    ),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await registerUser(data as RegisterDto);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Create your account to join CSS Battle competitions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              placeholder="e.g., de180914"
              {...register("studentId")}
              disabled={isLoading}
            />
            {errors.studentId && (
              <p className="text-sm text-destructive">
                {errors.studentId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register"}
          </Button>
        </form>

        {onSwitchToLogin && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={onSwitchToLogin}
                className="p-0 h-auto font-normal"
                disabled={isLoading}
              >
                Login here
              </Button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
