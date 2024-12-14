'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';

import useClientApi from '@/hooks/use-client';
import { TError, getErrorMessage, getLoggedErrorMessage } from '@/lib/utils';
import { reportError } from '@/query/api';

export default function ErrorScreen({ error }: { error: TError }) {
  const path = usePathname();
  const axios = useClientApi();

  const message = getErrorMessage(error);
  const loggedMessage = getLoggedErrorMessage(error);

  useEffect(() => {
    reportError(axios, `${path} > ${loggedMessage}`);
    console.error(loggedMessage);
  }, [axios, message, path, loggedMessage]);

  if (typeof error === 'object' && 'error' in error && 'status' in error.error && error.error.status === 404) return <NotFound />;

  return (
    <div className="col-span-full flex h-full w-full flex-col items-center justify-center gap-2 bg-background p-2">
      <h2 className="text-base font-bold">{message}</h2>
      <div className="grid grid-cols-2 items-center justify-center gap-2">
        <a className="h-9 flex-1 text-nowrap rounded-md text-sm border border-border justify-center items-center px-4 py-2" href="https://discord.gg/DCX5yrRUyp" target="_blank" rel="noopener noreferrer">
          <Tran text="report-error-at" />
        </a>
        <Button className="flex-1" variant="primary" onClick={() => window.location.reload()}>
          <Tran text="refresh" />
        </Button>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="col-span-full flex h-full w-full flex-col items-center justify-center gap-2 bg-background p-2">
      <h2 className="text-base font-bold">
        <Tran text="not-found" />
      </h2>
      <p>
        <Tran text="not-found-description" />
      </p>
      <BackButton />
    </div>
  );
}
