import React from 'react';
import SchematicsPage from './schematics-page';
import getQueryClient from '@/query/config/query-client';
import getMaps from '@/query/map/get-maps';
import { PageableSearchQuery } from '@/types/data/pageable-search-schema';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getServerAPI from '@/query/config/axios-config';
export default async function Page({
  searchParams,
}: {
  searchParams: PageableSearchQuery;
}) {
  const queryClient = getQueryClient();
  const { axios } = await getServerAPI();
  await queryClient.prefetchInfiniteQuery({
    initialPageParam: searchParams,
    queryKey: ['schematics', searchParams],
    queryFn: (context) => getMaps(axios, context.pageParam),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SchematicsPage />
    </HydrationBoundary>
  );
}
