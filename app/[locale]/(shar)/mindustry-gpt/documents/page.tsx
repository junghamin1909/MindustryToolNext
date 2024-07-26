'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import InfinitePage from '@/components/common/infinite-page';
import LoadingWrapper from '@/components/common/loading-wrapper';
import DocumentCard from '@/components/document/document-card';
import NameTagSearch from '@/components/search/name-tag-search';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import getDocuments from '@/query/documents/get-documents';
import postDocument from '@/query/documents/post-document';
import {
  PostDocumentRequest,
  PostDocumentRequestSchema,
} from '@/types/request/PostDocumentRequest';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function Page() {
  const params = useSearchPageParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const t = useI18n();

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-4">
      <div
        className="relative flex h-full flex-col overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <InfinitePage
          className="grid w-full  gap-2 md:grid-cols-2 lg:grid-cols-3"
          queryKey={['documents']}
          getFunc={getDocuments}
          params={params}
          container={() => container}
        >
          {(data) => <DocumentCard key={data.id} document={data} />}
        </InfinitePage>
      </div>
      <div className="flex justify-end">
        <AddDocumentButton />
      </div>
    </div>
  );
}

function AddDocumentButton() {
  const axios = useClientAPI();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const t = useI18n();

  const form = useForm<PostDocumentRequest>({
    resolver: zodResolver(PostDocumentRequestSchema),
    defaultValues: {
      content: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PostDocumentRequest) => postDocument(axios, data),
    onSuccess: () => {
      toast({
        title: t('upload.success'),
        variant: 'success',
      });
      invalidateByKey(['documents']);
      form.reset();
    },
    onError(error) {
      toast({
        title: t('upload.fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function handleSubmit(value: PostDocumentRequest) {
    mutate(value);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Add document" variant="primary">
          Add document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto rounded-md">
          <Form {...form}>
            <form
              className="flex flex-1 flex-col justify-between space-y-2"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex flex-1 flex-col gap-2 space-y-4 rounded-md p-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-60"
                          placeholder="Some cool stuff"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-end justify-center rounded-md p-2">
                <Button
                  className="w-fit"
                  variant="primary"
                  type="submit"
                  title={t('upload')}
                  disabled={isPending}
                >
                  <LoadingWrapper isLoading={isPending}>
                    {t('upload')}
                  </LoadingWrapper>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
