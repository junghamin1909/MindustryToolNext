'use client';

import React from 'react';

import UserCardSkeleton from '@/components/skeleton/user-card-skeleton';
import UserCard from '@/components/user/user-card';
import useClientApi from '@/hooks/use-client';
import { User } from '@/types/response/User';

import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/query/user';

type IdUserCardProps = {
  id: string | 'community';
};

export default function IdUserCard({ id }: IdUserCardProps) {
  if (id === 'null' || id == null || id == undefined || id.length === 0) {
    return <span></span>;
  }

  return <FletchUserCard id={id} />;
}

function FletchUserCard({ id }: IdUserCardProps) {
  const axios = useClientApi();
  const { data, isLoading, isError, error } = useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => getUser(axios, { id }),
    retry: false,
  });

  if (isError || error) {
    if ('status' in error && error.status === 404) {
      return undefined;
    }

    return <span>{error?.message}</span>;
  }

  if (isLoading || !data) {
    return <UserCardSkeleton />;
  }

  return <UserCard user={data} />;
}
