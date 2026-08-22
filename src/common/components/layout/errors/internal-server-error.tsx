'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useDialogModalState } from '@/common/stores';

export default function InternalServerError() {
  const router = useRouter();
  const showModal = useDialogModalState((s) => s.showModal);

  useEffect(() => {
    showModal({
      modal: 'alert',
      title: '서버 에러',
      text: '서버 에러가 발생하였습니다.',
      handleAfterClose: () => {
        router.replace('/');
      },
    });
  }, []);

  return null;
}
