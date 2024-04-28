'use client';

import useSafeParam from '@/hooks/use-safe-param';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { CommandLineIcon, MapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

export default async function Layout({ children }: PageProps) {
  const t = useI18n();

  const id = useSafeParam().get('id');
  let pathname = usePathname();
  let firstSlash = pathname.indexOf('/', 1);
  pathname = pathname.slice(firstSlash);

  const links: {
    href: string;
    label: ReactNode;
  }[] = [
    {
      href: '',
      label: (
        <>
          <CommandLineIcon className="h-5 w-5" />
          <span>{t('console')}</span>
        </>
      ),
    },
    {
      href: '/maps',
      label: (
        <>
          <MapIcon className="h-5 w-5" />
          <span>{t('map')}</span>
        </>
      ),
    },
  ];

  return (
    <div className="grid h-full grid-flow-row grid-rows-[auto,1fr] gap-2 overflow-hidden rounded-md md:grid-cols-[auto,1fr] md:grid-rows-1">
      <div className="flex flex-col gap-2 bg-card p-2">
        {links.map(({ href, label }) => (
          <Link
            className={cn('px-2 py-1 text-sm font-semibold opacity-70', {
              'opacity-100':
                (pathname.includes(href) && href !== '') ||
                (href === '' && pathname === `/admin/servers/${id}`),
            })}
            key={href}
            href={`/admin/servers/${id}/${href}`}
          >
            <div className="flex items-center gap-2">{label}</div>
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
