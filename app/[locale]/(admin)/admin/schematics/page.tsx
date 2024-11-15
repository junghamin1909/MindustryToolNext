import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(admin)/admin/schematics/page.client';
import env from '@/constant/env';
import ErrorScreen from '@/components/common/error-screen';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';
import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getSchematicUploads } from '@/query/schematic';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${env.webName} > Schematic`,
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

  const schematics = await serverApi((axios) => getSchematicUploads(axios, data));

  if (isError(schematics)) {
    return <ErrorScreen error={schematics} />;
  }

  return <Client schematics={schematics} />;
}
