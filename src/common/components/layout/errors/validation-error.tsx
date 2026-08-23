'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useDialogModalState } from '@/common/stores';

interface Props {
  redirectTo: string;
}

export default function ValidationError({ redirectTo }: Props) {
  const router = useRouter();
  const showModal = useDialogModalState((s) => s.showModal);

  useEffect(() => {
    showModal({
      modal: 'alert',
      title: '잘못된 URL',
      text: 'URL 형식이 잘못되었습니다.',
      handleAfterClose: () => {
        router.replace(redirectTo);
      },
    });
  }, []);

  return null;
}
