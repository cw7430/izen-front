'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores';

import { useDialogModalState } from '@/common/stores';

export default function Unauthorized() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const showModal = useDialogModalState((s) => s.showModal);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    showModal({
      modal: 'alert',
      title: '로그인',
      text: '로그인이 필요한 서비스입니다.',
      handleAfterClose: () => {
        logout();
        router.replace(
          `/login?redirect=${encodeURIComponent(`${pathname}?${params}`)}`,
        );
      },
    });
  }, []);

  return null;
}
