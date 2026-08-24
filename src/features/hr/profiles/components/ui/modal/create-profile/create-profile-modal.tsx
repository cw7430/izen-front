'use client';

import { useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useIsMutating } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/shallow';
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';

import { useModalState, useDialogModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import {
  type DepartmentListResponseDto,
  type PositionListResponseDto,
  type CreateProfileRequestDto,
  createProfileRequestSchema,
} from '@/features/hr/profiles/schemas';
import { createProfile } from '@/features/hr/profiles/server/actions';
import { PROFILE_KEYS } from '@/features/hr/profiles/constants';
import CreateEmployeeCodeButton from './create-employee-code-button';

interface Props {
  modalKey: string;
  allowedProfileTeams: string[];
  departments: DepartmentListResponseDto;
  positions: PositionListResponseDto;
}

export default function CreateProfileModal({
  modalKey,
  allowedProfileTeams,
  departments,
  positions,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const { modals, closeModal } = useModalState(
    useShallow((s) => ({ modals: s.modals, closeModal: s.closeModal })),
  );
  const showDialogModal = useDialogModalState((s) => s.showModal);
  const team = useAuthStore((s) => s.team);

  const isOpen = modals.includes(modalKey);
  const isPermitted = team ? allowedProfileTeams.includes(team) : false;

  const [departmentCode, setDepartmentCode] = useState<string>('');

  const createProfileForm = useForm<CreateProfileRequestDto>({
    mode: 'onChange',
    resolver: zodResolver(createProfileRequestSchema),
    defaultValues: {
      employeeCode: '',
      employeeName: '',
      positionCode: '',
      employeeRole: undefined,
      teamCode: '',
      phone: '',
      email: '',
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = createProfileForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('employeeCode');
      clearErrors('employeeName');
      clearErrors('positionCode');
      clearErrors('employeeRole');
      clearErrors('teamCode');
      clearErrors('phone');
      clearErrors('email');
    }
  };

  const availableTeams = useMemo(() => {
    const dept = departments.find((d) => d.departmentCode === departmentCode);
    return dept ? dept.teams : [];
  }, [departments, departmentCode]);

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
      <Modal.Header closeButton>사원 등록</Modal.Header>
    </Modal>
  );
}
