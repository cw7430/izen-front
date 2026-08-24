'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useDialogModalState } from '@/common/stores';

export default function KeyError() {
  const router = useRouter();
  const showModal = useDialogModalState((s) => s.showModal);

  useEffect(() => {
    showModal({
      modal: 'alert',
      title: 'API KEY 에러',
      text: 'API KEY가 잘못되었습니다. 관리자에게 문의하세요.',
      handleAfterClose: () => {
        router.replace('/');
      },
    });
  }, []);

  return null;
}
