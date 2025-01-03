'use client';

import dynamic from 'next/dynamic';
import React, { use, useState } from 'react';

import FileList from '@/app/[locale]/(user)/servers/[id]/files/file-list';

import { ArrowLeftCircleIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import FileHierarchy from '@/components/file/file-hierarchy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import useQueryState from '@/hooks/use-query-state';

const AddFileDialog = dynamic(() => import('@/app/[locale]/(user)/servers/[id]/files/add-file-dialog'));

const defaultState = {
  path: '/',
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [{ path }, setQueryState] = useQueryState(defaultState);
  const [search, setSearch] = useState('');

  function setFilePath(path: string) {
    const newPath = path.replaceAll('//', '/') || '/';

    setQueryState({ path: newPath });
  }

  const isNotRoot = path !== '/';

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2 py-2">
      <FileHierarchy path={path} onClick={setFilePath} />
      <div className="flex gap-2">
        <Input placeholder="Search file name" value={search} onChange={(event) => setSearch(event.target.value)} />
        <AddFileDialog id={id} path={path} />
      </div>
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        {isNotRoot && (
          <Button className="items-center h-10 justify-start px-2" title=".." onClick={() => setFilePath(path.split('/').slice(0, -1).join('/'))}>
            <ArrowLeftCircleIcon className="w-5"></ArrowLeftCircleIcon>
          </Button>
        )}
        <ScrollContainer className="flex h-full flex-col gap-2">
          <FileList id={id} path={path} filter={search} setFilePath={setFilePath} />
        </ScrollContainer>
      </div>
    </div>
  );
}
