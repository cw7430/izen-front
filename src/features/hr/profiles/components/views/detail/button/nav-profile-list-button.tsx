'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'react-bootstrap';

interface Props {
  defaultRedirectTo: string;
}

export default function NavProfileListButton({ defaultRedirectTo }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect');

  const redirectTo =
    redirect && redirect.startsWith('/') ? redirect : defaultRedirectTo;

  const onClick = () => {
    router.push(redirectTo);
  };

  return (
    <Button variant="secondary" onClick={onClick}>
      목록으로
    </Button>
  );
}
