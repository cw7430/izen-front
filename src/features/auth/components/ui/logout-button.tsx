'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'react-bootstrap';

import { useAuthStore } from '@/features/auth/stores/auth';
import { AUTH_KEYS } from '@/features/auth/constants';
import { logoutAction } from '@/features/auth/server/actions';

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = useAuthStore((s) => s.logout);

  const mutation = useMutation({
    mutationKey: AUTH_KEYS.logout,
    mutationFn: logoutAction,
    onSettled: () => {
      logout();
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    },
  });

  const onClick = async () => {
    mutation.mutate();
  };

  return (
    <Button
      variant="outline-light"
      type="button"
      onClick={onClick}
      disabled={mutation.isPending}
    >
      로그아웃
    </Button>
  );
}
