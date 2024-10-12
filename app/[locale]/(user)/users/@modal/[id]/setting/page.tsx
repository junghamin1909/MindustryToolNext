import { getSession } from '@/action/action';
import UpdateThumbnail from '@/app/[locale]/(user)/users/@modal/[id]/setting/update-thumbnail';
import ErrorScreen from '@/components/common/error-screen';
import React from 'react';

export default async function Page() {
  const session = await getSession();

  if ('error' in session) {
    return <ErrorScreen error={session} />;
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <UpdateThumbnail id={session.id} />
    </div>
  );
}
