'use client';

import React, { useState } from 'react';

import { UserManagementCard } from '@/app/[locale]/(admin)/admin/users/user-management-card';

import ComboBox from '@/components/common/combo-box';
import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import { Input } from '@/components/ui/input';

import useClientQuery from '@/hooks/use-client-query';
import useQueryState from '@/hooks/use-query-state';
import useSearchQuery from '@/hooks/use-search-query';
import { useI18n } from '@/i18n/client';
import { omit } from '@/lib/utils';
import { getRoles } from '@/query/role';
import { ItemPaginationQuery } from '@/query/search-query';
import { getUserCount, getUsers } from '@/query/user';
import { Role } from '@/types/response/Role';

const defaultState = {
  name: '',
};

export function UserTable() {
  const t = useI18n();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const params = useSearchQuery(ItemPaginationQuery);

  const [{ name }, setQueryState] = useQueryState(defaultState);

  const [role, setRole] = useState<Role>();
  const { data: roles } = useClientQuery({
    queryFn: (axios) => getRoles(axios),
    queryKey: ['roles'],
  });

  const { data: userCount } = useClientQuery({
    queryKey: ['users', 'total', omit(params, 'page', 'size')],
    queryFn: (axios) => getUserCount(axios, { ...params, role: role?.name }),
    placeholderData: 0,
  });

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden">
      <div>
        <div className="flex h-10 gap-2">
          <Input className="h-full" value={name} onChange={(event) => setQueryState({ name: event.target.value })} placeholder="Search using username" />
          <ComboBox className="h-full" placeholder="Select role" value={{ value: role, label: role?.name ? t(role.name) : '' }} values={roles?.map((d) => ({ value: d, label: t(d.name) })) ?? []} onChange={(value) => setRole(value)} />
        </div>
      </div>
      <ScrollContainer className="flex h-full flex-col gap-2" ref={(ref) => setContainer(ref)}>
        <ListLayout>
          <InfinitePage className="flex h-full w-full flex-col justify-start gap-2" params={{ ...params, role: role?.name, name }} queryKey={['users', 'management']} queryFn={getUsers} container={() => container}>
            {(data) => <UserManagementCard key={data.id} user={data} />}
          </InfinitePage>
        </ListLayout>
        <GridLayout>
          <GridPaginationList className="flex flex-col gap-2" params={{ ...params, role: role?.name, name }} queryKey={['users', 'management']} queryFn={getUsers}>
            {(data) => <UserManagementCard key={data.id} user={data} />}
          </GridPaginationList>
        </GridLayout>
      </ScrollContainer>
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <GridLayout>
          <PaginationNavigator numberOfItems={userCount} />
        </GridLayout>
      </div>
    </div>
  );
}
