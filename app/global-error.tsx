'use client';

import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
}: {
  error: Error & { digest?: string } & any;
}) {
  const message = error.message ?? 'Something went wrong!';

  if (message === 'NEXT_NOT_FOUND') {
    throw notFound();
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h2 className="text-base font-bold">{message}</h2>
      <div className="grid grid-cols-2 items-center justify-center gap-2">
        <a
          className="h-9 flex-1 text-nowrap rounded-md border border-border px-2 py-1.5"
          href="https://discord.gg/DCX5yrRUyp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Report Error At
        </a>
        <Button
          className="flex-1"
          variant="primary"
          title="Refresh"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
