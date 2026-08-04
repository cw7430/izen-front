'use client';

import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/shallow';
import { Button, Form, Spinner } from 'react-bootstrap';

import { useAppConfigStore } from '@/common/stores';

import {
  loginRequestSchema,
  type LoginRequestDto,
} from '@/features/auth/schemas';
import { PasswordInput } from '@/common/components/ui/input';

export default function LoginForm() {
  const { isAutoLogin, setAutoLogin } = useAppConfigStore(
    useShallow((s) => ({
      isAutoLogin: s.isAutoLogin,
      setAutoLogin: s.setAutoLogin,
    })),
  );

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

  const onSubmit: SubmitHandler<LoginRequestDto> = (req) => {
    alert(JSON.stringify(req, null, 2));
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
            onChange={(e) => {
              field.onChange(e.currentTarget.checked);
              setAutoLogin(e.currentTarget.checked);
            }}
          />
        )}
      />
    </Form>
  );
}
