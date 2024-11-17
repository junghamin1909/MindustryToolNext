import { Metadata } from 'next/dist/types';

import { serverApi, translate } from '@/action/action';
import Client from '@/app/[locale]/(admin)/admin/posts/post.client';
import ErrorScreen from '@/components/common/error-screen';
import env from '@/constant/env';
import { formatTitle, isError } from '@/lib/utils';
import { getPostUploads } from '@/query/post';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('post');

  return {
    title: formatTitle(title),
  };
}

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
};

export default async function Page({ searchParams }: Props) {
  const { data, success, error } = ItemPaginationQuery.safeParse(await searchParams);

  if (!success || !data) {
    return <ErrorScreen error={error} />;
  }

  const posts = await serverApi((axios) => getPostUploads(axios, data));

  if (isError(posts)) {
    return <ErrorScreen error={posts} />;
  }

  return <Client posts={posts} />;
}
