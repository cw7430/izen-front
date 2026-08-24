'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { UseFormSetValue, UseFormSetError } from 'react-hook-form';
import { useMutation, useIsMutating } from '@tanstack/react-query';
import { Button, Spinner } from 'react-bootstrap';

import type { CreateProfileRequestDto } from '@/features/hr/profiles/schemas';
import { getEmployeeCode } from '@/features/hr/profiles/server/actions';
import { useDialogModalState, useModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { PROFILE_KEYS } from '@/features/hr/profiles/constants';

interface Props {
  setError: UseFormSetError<CreateProfileRequestDto>;
  setValue: UseFormSetValue<CreateProfileRequestDto>;
  employeeCode: string;
  modalKey: string;
}

export default function CreateEmployeeCodeButton({
  setError,
  setValue,
  modalKey,
  employeeCode,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const showAlertModal = useDialogModalState((s) => s.showModal);
  const closeModal = useModalState((s) => s.closeModal);
  const logout = useAuthStore((s) => s.logout);

  const isCreatingProfile =
    useIsMutating({ mutationKey: PROFILE_KEYS.createProfile }) > 0;

  const mutation = useMutation({
    mutationKey: PROFILE_KEYS.generateEmployeeCode,
    mutationFn: getEmployeeCode,
    onSuccess: (res) => {
      if (!res.success) {
        switch (res.error.code) {
          case 'UA':
          case 'IT':
          case 'ET':
            showAlertModal({
              modal: 'alert',
              title: '로그인',
              text: '로그인이 필요한 서비스입니다.',
              handleAfterClose: () => {
                closeModal(modalKey);
                logout();
                router.replace(
                  `/login?redirect=${encodeURIComponent(`${pathname}?${params}`)}`,
                );
              },
            });
            break;
          case 'FB':
            showAlertModal({
              modal: 'alert',
              title: '권한 오류',
              text: '권한이 없습니다.',
              handleAfterClose: () => {
                closeModal(modalKey);
              },
            });
            break;
          default:
            setError('employeeCode', {
              message:
                '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
        return;
      }

      setValue('employeeCode', res.data.employeeCode, {
        shouldValidate: true,
      });
    },
    onError: () => {
      setError('employeeCode', {
        message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    },
  });

  const onClick = () => {
    mutation.mutate();
  };

  return (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={mutation.isPending || isCreatingProfile || !!employeeCode}
    >
      {mutation.isPending && <Spinner size="sm" />}
      발급
    </Button>
  );
}
