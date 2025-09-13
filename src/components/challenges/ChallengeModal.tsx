"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChallengeCreationForm from "./ChallengeCreateForm";
import { Challenge } from "@/types/api";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge?: Challenge | null;
  mode: "create" | "edit";
}

export function ChallengeModal({
  isOpen,
  onClose,
  challenge,
  mode,
}: ChallengeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Challenge" : "Edit Challenge"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new challenge to the CSS Battle collection"
              : "Update the challenge details"}
          </DialogDescription>
        </DialogHeader>

        <ChallengeCreationForm />
      </DialogContent>
    </Dialog>
  );
}
