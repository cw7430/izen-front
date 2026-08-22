'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';

import { refreshAction } from '@/features/auth/server/actions';
import { useAppConfigStore, useDialogModalState } from '@/common/stores';
import { useAuthStore, validateAuthIntegrity } from '@/features/auth/stores';
import type { RefreshRequestDto } from '@/features/auth/schemas';
import { AUTH_KEYS } from '@/features/auth/constants';

interface Props {
  hasAccessToken: boolean;
}

export default function AuthInitalizer({ hasAccessToken }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const isAutoLogin = useAppConfigStore((s) => s.isAutoLogin);
  const showModal = useDialogModalState((s) => s.showModal);
  const { isLoggedIn, logout, login, hasHydrated } = useAuthStore(
    useShallow((s) => ({
      isLoggedIn: validateAuthIntegrity(s),
      logout: s.logout,
      login: s.login,
      hasHydrated: s.hasHydrated,
    })),
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleAuthFailure = useCallback(() => {
    logout();
    clearRefreshTimer();
    showModal({
      modal: 'alert',
      title: '세션만료',
      text: '세션이 만료되었습니다. 로그아웃합니다.',
      handleAfterClose: () => {
        router.replace(
          `/login?redirect=${encodeURIComponent(`${pathname}?${params}`)}`,
        );
      },
    });
  }, [logout, clearRefreshTimer, showModal, router, pathname]);

  const { mutateAsync: refreshMutate } = useMutation({
    mutationKey: AUTH_KEYS.refresh,
    mutationFn: refreshAction,
    onSuccess: (res, req) => {
      if (res.success) {
        login(res.data);
        scheduleRefresh(res.data.accessTokenExpiresAtMs, req);
      } else {
        handleAuthFailure();
      }
    },
    onError: () => {
      handleAuthFailure();
    },
  });

  const scheduleRefresh = useCallback(
    (expiresAt: number, req: RefreshRequestDto) => {
      clearRefreshTimer();

      const now = Date.now();
      const timeUntilRefresh = Math.max(0, expiresAt - now - 2 * 60 * 1000);

      timerRef.current = setTimeout(() => {
        refreshMutate(req);
      }, timeUntilRefresh);
    },
    [refreshMutate, clearRefreshTimer],
  );

  const recoverAuth = useCallback(
    async (req: RefreshRequestDto) => {
      const { accessTokenExpiresAtMs } = useAuthStore.getState();

      if (hasAccessToken && accessTokenExpiresAtMs && isLoggedIn) {
        scheduleRefresh(accessTokenExpiresAtMs, req);
        return;
      }

      await refreshMutate(req);
    },
    [scheduleRefresh, isLoggedIn, hasAccessToken, refreshMutate],
  );

  useEffect(() => {
    if (!hasHydrated || !isLoggedIn) return;

    const req = { isAuto: isAutoLogin };
    recoverAuth(req);

    return () => clearRefreshTimer();
  }, [hasHydrated, isAutoLogin, recoverAuth, clearRefreshTimer]);

  return null;
}
