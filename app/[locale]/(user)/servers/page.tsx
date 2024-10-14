import React, { Suspense } from 'react';

import CreateServerDialog from '@/app/[locale]/(user)/servers/create-server-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Tran from '@/components/common/tran';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { getSession } from '@/action/action';
import ProtectedElement from '@/layout/protected-element';
import { RequireLogin } from '@/app/[locale]/(user)/servers/require-login';
import { CommunityServer } from '@/app/[locale]/(user)/servers/community-server';
import { MeServer } from '@/app/[locale]/(user)/servers/my-server';
import { OfficialServer } from '@/app/[locale]/(user)/servers/official-server';
import ScrollContainer from '@/components/common/scroll-container';

export const experimental_ppr = true;

const skeleton = Array(20)
  .fill(1)
  .map((_, index) => <InternalServerCardSkeleton key={index} />);

export default async function Page() {
  const session = await getSession();

  return (
    <div className="flex h-full flex-col overflow-hidden p-2">
      <Tabs className="flex w-full flex-col overflow-hidden" defaultValue="official-server">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div>
            <TabsList>
              <TabsTrigger value="official-server">
                <Tran text="server.official-server" />
              </TabsTrigger>
              <TabsTrigger value="community-server">
                <Tran text="server.community-server" />
              </TabsTrigger>
              <TabsTrigger value="my-server">
                <Tran text="server.my-server" />
              </TabsTrigger>
            </TabsList>
          </div>
          <ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
            <CreateServerDialog />
          </ProtectedElement>
        </div>
        <TabsContent value="official-server">
          <Suspense fallback={skeleton}>
            <ScrollContainer className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto">
              <OfficialServer />
            </ScrollContainer>
          </Suspense>
        </TabsContent>
        <TabsContent value="community-server">
          <Suspense fallback={skeleton}>
            <ScrollContainer className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto">
              <CommunityServer />
            </ScrollContainer>
          </Suspense>
        </TabsContent>
        <TabsContent value="my-server">
          <ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
            <Suspense fallback={skeleton}>
              <ScrollContainer className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto">
                <MeServer />
              </ScrollContainer>
            </Suspense>
          </ProtectedElement>
        </TabsContent>
      </Tabs>
    </div>
  );
}
