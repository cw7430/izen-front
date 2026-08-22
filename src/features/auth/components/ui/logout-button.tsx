'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'react-bootstrap';

import { useAuthStore } from '@/features/auth/stores';
import { AUTH_KEYS } from '@/features/auth/constants';
import { logoutAction } from '@/features/auth/server/actions';

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const logout = useAuthStore((s) => s.logout);

  const mutation = useMutation({
    mutationKey: AUTH_KEYS.logout,
    mutationFn: logoutAction,
    onSettled: () => {
      logout();
      router.replace(
        `/login?redirect=${encodeURIComponent(`${pathname}?${params}`)}`,
      );
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
