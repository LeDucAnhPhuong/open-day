"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
  triggerText?: string;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  defaultMode?: "login" | "register";
  onAuthSuccess?: () => void;
}

export function AuthModal({
  triggerText = "Login",
  triggerVariant = "default",
  defaultMode = "login",
  onAuthSuccess,
}: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  const handleSuccess = () => {
    setIsOpen(false);
    onAuthSuccess?.();
    window.location.reload();
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Welcome Back" : "Join CSS Battle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Create an account to start competing"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          {mode === "login" ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={switchMode}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={switchMode}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
