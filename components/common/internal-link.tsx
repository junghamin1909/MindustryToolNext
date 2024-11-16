'use client';

import { VariantProps, cva } from 'class-variance-authority';
import React, { useCallback } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import env from '@/constant/env';
import { useLocaleStore } from '@/context/locale-context';
import { locales } from '@/i18n/config';

const linkVariants = cva('flex gap-2', {
  variants: {
    variant: {
      default: '',
      primary: 'text-brand hover:text-brand',
      'button-primary': 'rounded-md border bg-brand p-2 text-sm text-background dark:text-foreground',
      'button-secondary': 'items-center flex gap-2 rounded-md bg-secondary px-2 py-1.5',
      command: 'hover:bg-accent justify-start gap-1 flex items-center p-2 w-full rounded-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type InternalLinkVariants = VariantProps<typeof linkVariants>;

export type InternalLinkProps = React.ButtonHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkVariants> & {
    asChild?: boolean;
  } & {
    href: string;
    preloadImage?: string;
  };

export default function InternalLink({ className, variant, title, href, children, preloadImage, ...props }: InternalLinkProps) {
  const t = useI18n();
  const { currentLocale } = useLocaleStore();

  const stripBase = href.replace(env.url.base, '');
  const parts = stripBase.split('/');

  if (parts.length > 0 && !locales.includes(parts[0] as any)) {
    href = new URL(env.url.base + '/' + currentLocale + '/' + stripBase).toString();
  }

  const handlePreload = useCallback(() => {
    if (preloadImage) {
      const image = new Image();
      image.src = preloadImage;
    }
  }, [preloadImage]);

  return (
    <Link className={cn(linkVariants({ variant, className }))} {...props} href={href} hrefLang={currentLocale} title={title ? t(title) : ''} onMouseEnter={handlePreload} onTouchStart={handlePreload}>
      {children}
    </Link>
  );
}
