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
      text: '서버 문제가 발생하였습니다. 잠시 후 다시 시도해주세요.',
      handleAfterClose: () => {
        router.replace('/');
      },
    });
  }, []);

  return null;
}
