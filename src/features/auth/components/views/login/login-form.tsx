'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/shallow';
import { Button, Form, Spinner } from 'react-bootstrap';

import { useAppConfigStore } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import {
  loginRequestSchema,
  type LoginRequestDto,
} from '@/features/auth/schemas';
import { loginAction } from '@/features/auth/server/actions';
import { PasswordInput } from '@/common/components/ui/input';
import { AUTH_KEYS } from '@/features/auth/constants';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isAutoLogin, setAutoLogin } = useAppConfigStore(
    useShallow((s) => ({
      isAutoLogin: s.isAutoLogin,
      setAutoLogin: s.setAutoLogin,
    })),
  );

  const login = useAuthStore((s) => s.login);

  const redirect = searchParams.get('redirect');

  const redirectTo = redirect && redirect.startsWith('/') ? redirect : '/';

  const loginForm = useForm<LoginRequestDto>({
    mode: 'onChange',
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { userName: '', password: '', isAuto: isAutoLogin },
  });

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = loginForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('userName');
      clearErrors('password');
    }
  };

  const mutation = useMutation({
    mutationKey: AUTH_KEYS.login,
    mutationFn: loginAction,
    onSuccess: (res) => {
      if (!res.success) {
        switch (res.error.code) {
          case 'LGE':
          case 'VE':
            setError('root', {
              message: '아이디 또는 비밀번호가 올바르지 않습니다.',
            });
            break;
          default:
            setError('root', {
              message:
                '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
            });
        }
        return;
      }

      login(res.data);
      router.replace(redirectTo);
    },
    onError: () => {
      setError('root', {
        message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    },
  });

  const onSubmit: SubmitHandler<LoginRequestDto> = (req) => {
    mutation.mutate(req);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleFormChange}
      noValidate
    >
      <Form.Group className="mb-2" controlId="login.user-name">
        <Form.Label>아이디</Form.Label>
        <Controller
          control={control}
          name="userName"
          render={({ field }) => (
            <Form.Control
              type="text"
              placeholder="아이디를 입력해주세요"
              {...field}
              isInvalid={!!errors.userName}
              disabled={mutation.isPending}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.userName?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-2" controlId="login.password">
        <Form.Label>비밀번호</Form.Label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              placeholder="비밀번호를 입력해주세요"
              {...field}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              disabled={mutation.isPending}
            />
          )}
        />
      </Form.Group>
      <Controller
        control={control}
        name="isAuto"
        render={({ field }) => (
          <Form.Check
            type="checkbox"
            label="자동 로그인"
            id="login.is-auto"
            className="mb-3"
            checked={field.value}
            disabled={mutation.isPending}
            onChange={(e) => {
              field.onChange(e.currentTarget.checked);
              setAutoLogin(e.currentTarget.checked);
            }}
          />
        )}
      />

      {errors.root && (
        <div className="d-block invalid-feedback mb-2">
          {errors.root.message}
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-100 mt-2 mb-3"
        disabled={mutation.isPending}
      >
        {mutation.isPending && <Spinner size="sm" />}
        로그인
      </Button>
    </Form>
  );
}
