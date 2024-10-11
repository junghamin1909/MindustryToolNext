import { RoleTable } from '@/app/[locale]/(admin)/admin/users/role-table';
import { UserTable } from '@/app/[locale]/(admin)/admin/users/user-table';
import RouterSpinner from '@/components/common/router-spinner';
import Tran from '@/components/common/tran';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { Suspense } from 'react';

export default function Page() {
  return (
    <Tabs
      className="flex h-full w-full flex-col overflow-hidden p-4"
      defaultValue="user"
    >
      <div className="flex flex-wrap justify-start gap-2">
        <TabsList>
          <TabsTrigger value="user">
            <Tran text="user" />
          </TabsTrigger>
          <TabsTrigger value="role">
            <Tran text="role" />
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent className="h-full overflow-hidden" value="user">
        <UserTable />
      </TabsContent>
      <TabsContent className="h-full overflow-hidden" value="role">
        <Suspense fallback={<RouterSpinner />}>
          <RoleTable />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
