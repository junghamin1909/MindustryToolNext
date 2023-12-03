import NoMore from '@/components/common/no-more';
import NoResult from '@/components/common/no-result';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useInfinitePageQuery from '@/hooks/use-infinite-page-query';
import { SearchParams } from '@/schema/search-schema';
import React, { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

type InfinitePageProps<T> = {
  queryKey: any[];
  getFunc: (params: SearchParams) => Promise<T[]>;
  children: (data: T) => ReactNode;
};

export default function InfinitePage<T>({
  queryKey,
  getFunc,
  children,
}: InfinitePageProps<T>) {
  const { data, isLoading, error, isError, hasNextPage, fetchNextPage } =
    useInfinitePageQuery(getFunc, queryKey);

  if (isError) {
    return (
      <div className="flex w-full justify-center">Error : {error.message}</div>
    );
  }

  if (!data || isLoading) {
    return (
      <LoadingSpinner className="absolute bottom-0 left-0 right-0 top-0" />
    );
  }

  const pages = data?.pages.reduce((prev, curr) => prev.concat(curr), []) ?? [];

  if (pages.length === 0) {
    return (
      <NoResult className="w-full flex items-center justify-center" />
    );
  }

  return (
    <InfiniteScroll
      className="grid min-h-full w-full grid-cols-[repeat(auto-fill,var(--preview-size))] items-center justify-center gap-4 p-4"
      next={fetchNextPage}
      dataLength={pages.length}
      hasMore={hasNextPage}
      loader={
        <LoadingSpinner className="col-span-full flex w-full items-center justify-center" />
      }
      endMessage={
        <NoMore className="col-span-full flex w-full items-center justify-center " />
      }
    >
      {pages.map((page, index) => (
        <React.Fragment key={index}>{children(page)}</React.Fragment>
      ))}
    </InfiniteScroll>
  );
}
