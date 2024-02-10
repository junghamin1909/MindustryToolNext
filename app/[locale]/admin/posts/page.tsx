'use client';

import InfinitePage from '@/components/common/infinite-page';
import UploadPostPreviewCard from '@/components/post/upload-post-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import useSearchPageParams from '@/hooks/use-search-page-params';
import useTags from '@/hooks/use-tags';
import getPostUploads from '@/query/post/get-post-upload';
import React, { useRef } from 'react';

export default function Page() {
  const { post } = useTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="relative flex h-full flex-col gap-4 overflow-y-auto pr-2"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={post} />
      <InfinitePage
        className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-4"
        params={params}
        queryKey={['post-uploads']}
        getFunc={getPostUploads}
        scrollContainer={scrollContainer.current}
      >
        {(data) => <UploadPostPreviewCard key={data.id} post={data} />}
      </InfinitePage>
    </div>
  );
}
