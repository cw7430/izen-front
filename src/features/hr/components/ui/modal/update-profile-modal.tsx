'use client';

import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { Modal } from 'react-bootstrap';

import { useModalState, useDialogModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { type ProfileDetailResponseDto } from '@/features/hr/schemas';

interface Props {
  modalKey: string;
  profile: ProfileDetailResponseDto;
}

export default function UpdateProfileModal({ modalKey, profile }: Props) {
  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );
  const showDialogModal = useDialogModalState((s) => s.showModal);
  const team = useAuthStore((s) => s.team);

  const isOpen = modals.includes(modalKey);
  const isPermitted = team ? profile.allowedProfileTeams.includes(team) : false;

  useEffect(() => {
    if (isOpen) {
      if (!isPermitted) {
        showDialogModal({
          modal: 'alert',
          title: '권한 오류',
          text: '권한이 없습니다.',
          handleAfterClose: () => {
            closeModal(modalKey);
          },
        });
      }
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop="static"
      show={!!isOpen}
      onHide={() => closeModal(modalKey)}
    >
      <Modal.Header closeButton>사원 수정</Modal.Header>
    </Modal>
  );
}
