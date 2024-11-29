'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { BulkActionContainer, BulkDeleteToggle } from '@/components/common/bulk-action';
import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import UploadMapPreviewCard from '@/components/map/upload-map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';

import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchQuery from '@/hooks/use-search-query';
import { omit } from '@/lib/utils';
import { deleteMap, getMapUploadCount, getMapUploads } from '@/query/map';
import { ItemPaginationQuery } from '@/query/search-query';
import { Map } from '@/types/response/Map';

import { useMutation } from '@tanstack/react-query';

type Props = {
  maps: Map[];
};

export default function Client({ maps }: Props) {
  const {
    searchTags: { map },
  } = useTags();
  const params = useSearchQuery(ItemPaginationQuery);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['maps', 'total', 'upload', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getMapUploadCount(axios, params),
    placeholderData: 0,
  });

  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();

  const { mutate } = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteMap(axios, id))),
    onSuccess: () => {
      toast.success(<Tran text="delete-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['maps']);
    },
  });

  async function handleBulkDelete(value: string[]) {
    mutate(value);
  }

  return (
    <BulkActionContainer onActionPerform={handleBulkDelete}>
      <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
        <NameTagSearch tags={map} />
        <div className="flex items-center justify-between">
          <Tran className='text-muted-foreground' text="found" args={{ number: data }} />
          <div className="flex items-center gap-2">
            <BulkDeleteToggle />
            <PaginationLayoutSwitcher />
          </div>
        </div>
        <ScrollContainer className="relative flex h-full flex-col" ref={(ref) => setContainer(ref)}>
          <ListLayout>
            <InfinitePage
              params={params}
              queryKey={['maps', 'upload']}
              queryFn={getMapUploads}
              container={() => container}
              initialData={maps}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data, index) => <UploadMapPreviewCard key={data.id} map={data} imageCount={index} />}
            </InfinitePage>
          </ListLayout>
          <GridLayout>
            <GridPaginationList
              params={params}
              queryKey={['maps', 'upload']}
              queryFn={getMapUploads}
              initialData={maps}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data, index) => <UploadMapPreviewCard key={data.id} map={data} imageCount={index} />}
            </GridPaginationList>
          </GridLayout>
        </ScrollContainer>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-row-reverse sm:justify-between">
          <GridLayout>
            <PaginationNavigator numberOfItems={data} />
          </GridLayout>
        </div>
      </div>
    </BulkActionContainer>
  );
}
