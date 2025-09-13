'use client';

import { useState } from 'react';
import { ChallengesList, ChallengeModal } from '@/components/challenges';
import { Challenge } from '@/types/api';

export default function ChallengesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [viewingChallenge, setViewingChallenge] = useState<Challenge | null>(null);

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditChallenge = (challenge: Challenge) => {
    setEditingChallenge(challenge);
  };

  const handleViewChallenge = (challenge: Challenge) => {
    setViewingChallenge(challenge);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setEditingChallenge(null);
    setViewingChallenge(null);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <ChallengesList
          onCreateNew={handleCreateNew}
          onEditChallenge={handleEditChallenge}
          onViewChallenge={handleViewChallenge}
        />
      </div>

      {/* Create Challenge Modal */}
      <ChallengeModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        mode="create"
      />

      {/* Edit Challenge Modal */}
      <ChallengeModal
        isOpen={!!editingChallenge}
        onClose={closeModals}
        challenge={editingChallenge}
        mode="edit"
      />

      {/* View Challenge Modal */}
      {viewingChallenge && (
        <ChallengeModal
          isOpen={!!viewingChallenge}
          onClose={closeModals}
          challenge={viewingChallenge}
          mode="edit"
        />
      )}
    </div>
  );
}