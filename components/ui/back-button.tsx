'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { useI18n } from '@/locales/client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function BackButton({
  children,
  ...props
}: Omit<ButtonProps, 'title'>) {
  const router = useRouter();
  const t = useI18n();

  return (
    <Button
      className="whitespace-nowrap"
      title={t('back')}
      variant="outline"
      {...props}
      onClick={() => router.back()}
    >
      {children ?? t('back')}
    </Button>
  );
}
