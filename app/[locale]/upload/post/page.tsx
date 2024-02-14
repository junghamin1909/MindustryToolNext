'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import PostPostRequest from '@/types/request/PostPostRequest';
import postPost from '@/query/post/post-post';
import useClientAPI from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import useQueriesData from '@/hooks/use-queries-data';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import NameTagSelector from '@/components/search/name-tag-selector';
import LoadingWrapper from '@/components/common/loading-wrapper';
import useTags from '@/hooks/use-tags';
import useLanguages from '@/hooks/use-languages';
import ComboBox from '@/components/common/combo-box';
import { PostDetail } from '@/types/response/PostDetail';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Search from '@/components/search/search-input';
import getMePosts from '@/query/post/get-me-posts';
import LoadingSpinner from '@/components/common/loading-spinner';
import getPost from '@/query/post/get-post';
import NoResult from '@/components/common/no-result';
import postTranslatePost from '@/query/post/post-translate-post';
import TranslatePostRequest from '@/types/request/TranslatePostRequest';
import LoadingScreen from '@/components/common/loading-screen';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
);

type Shared = {
  header: string;
  setHeader: (data: string) => void;
  content: string;
  setContent: (data: string) => void;
  language: string;
  setLanguage: (data: string) => void;
};

export default function Page() {
  // If post is not undefined then its a translate request
  const [post, setPost] = useState<PostDetail>();
  const [header, setHeader] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [language, setLanguage] = useState('');

  function render() {
    if (post === undefined) {
      return (
        <>
          <div>
            <AddTranslationDialog onPostSelect={(post) => setPost(post)} />
          </div>
          <UploadPage
            shared={{
              header,
              setHeader,
              content,
              setContent,
              language,
              setLanguage,
            }}
          />
        </>
      );
    }

    return (
      <>
        <div>
          <Button
            title="Change to upload"
            variant="secondary"
            onClick={() => setPost(undefined)}
          >
            Go to upload page
          </Button>
        </div>
        <TranslatePage
          post={post}
          shared={{
            header,
            setHeader,
            content,
            setContent,
            language,
            setLanguage,
          }}
        />
      </>
    );
  }

  return <div className="flex h-full flex-col gap-2">{render()}</div>;
}

function TranslatePage({
  post,
  shared: { header, setHeader, content, setContent, language, setLanguage },
}: {
  shared: Shared;
} & { post: PostDetail }) {
  const { axios } = useClientAPI();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const languages = useLanguages();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TranslatePostRequest) => postTranslatePost(axios, data),
    onSuccess: () => {
      toast({
        title: 'Upload post success',
        variant: 'success',
      });
      setHeader('');
      setContent('');
      invalidateByKey(['post-uploads']);
      invalidateByKey(['total-post-uploads']);
    },
    onError(error) {
      toast({
        title: 'Upload post failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function checkUploadRequirement() {
    if (!header) return 'No title';

    if (!content) return 'No content';

    if (!language) return 'No language';

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  return (
    <div className="h-full overflow-y-auto rounded-md">
      <div className="hidden h-full flex-col justify-between gap-2 md:flex">
        <div className="flex w-full flex-col gap-2">
          <div className="w-full rounded-md bg-card p-2">
            <div className="font-bold">Title</div>
            <div className="select-text text-sm">{post.header}</div>
          </div>
          <div className="w-full rounded-md bg-card p-2">
            <div className="font-bold">Content</div>
            <div className="select-text text-sm">{post.content}</div>
          </div>
        </div>
        <div className="flex h-full flex-col gap-1 rounded-md bg-card p-2">
          <input
            className="w-full rounded-sm bg-white p-1 text-black outline-none hover:outline-none"
            placeholder="Title"
            value={header}
            onChange={(event) => setHeader(event.currentTarget.value)}
          />
          <MDEditor
            value={content}
            onChange={(value) => setContent(value ?? '')}
          />
        </div>
        <div className="flex justify-start gap-2 rounded-md bg-card p-2">
          <ComboBox
            placeholder="Select language"
            values={languages
              .filter((language) => language !== post.language)
              .map((value) => ({
                value,
                label: value,
              }))}
            onChange={(value) => setLanguage(value ?? '')}
          />
          <Button
            className="ml-auto"
            title="Submit"
            variant="primary"
            disabled={isPending || uploadCheck !== true}
            onClick={() =>
              mutate({
                id: post.id,
                header,
                content,
                language,
              })
            }
          >
            <LoadingWrapper isLoading={isPending}>
              {uploadCheck === true ? 'Upload' : uploadCheck}
            </LoadingWrapper>
          </Button>
        </div>
      </div>
      <span className="md:hidden">
        Mobile screen is not supported yet, please use a bigger screen
      </span>
    </div>
  );
}

function UploadPage({
  shared: { header, setHeader, content, setContent, language, setLanguage },
}: {
  shared: Shared;
}) {
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { axios } = useClientAPI();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const { post: postTags } = useTags();
  const languages = useLanguages();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PostPostRequest) => postPost(axios, data),
    onSuccess: () => {
      toast({
        title: 'Upload post success',
        variant: 'success',
      });
      setHeader('');
      setContent('');
      setSelectedTags([]);
      invalidateByKey(['post-uploads']);
      invalidateByKey(['total-post-uploads']);
    },
    onError(error) {
      toast({
        title: 'Upload post failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function checkUploadRequirement() {
    if (!header) return 'No title';

    if (!content) return 'No content';

    if (selectedTags.length === 0) return 'No tags';

    if (!language) return 'No language';

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  return (
    <div className="h-full overflow-y-auto rounded-md">
      <div className="hidden h-full flex-col justify-between gap-2 md:flex">
        <div className="flex h-full flex-col gap-1 rounded-md bg-card p-2">
          <input
            className="w-full rounded-sm bg-white p-1 text-black outline-none hover:outline-none"
            placeholder="Title"
            value={header}
            onChange={(event) => setHeader(event.currentTarget.value)}
          />
          <MDEditor
            value={content}
            onChange={(value) => setContent(value ?? '')}
          />
        </div>
        <div className="flex justify-start gap-2 rounded-md bg-card p-2">
          <ComboBox
            placeholder="Select language"
            values={languages.map((value) => ({
              value,
              label: value,
            }))}
            onChange={(value) => setLanguage(value ?? '')}
          />
          <NameTagSelector
            tags={postTags}
            value={selectedTags}
            setValue={setSelectedTags}
            hideSelectedTag
          />
          <Button
            className="ml-auto"
            title="Submit"
            variant="primary"
            disabled={isPending || uploadCheck !== true}
            onClick={() =>
              mutate({
                header,
                content,
                language,
                tags: TagGroups.toString(selectedTags),
              })
            }
          >
            <LoadingWrapper isLoading={isPending}>
              {uploadCheck === true ? 'Upload' : uploadCheck}
            </LoadingWrapper>
          </Button>
        </div>
      </div>
      <span className="md:hidden">
        Mobile screen is not supported yet, please use a bigger screen
      </span>
    </div>
  );
}

type AddTranslationDialogProps = {
  onPostSelect: (post: PostDetail) => void;
};

function AddTranslationDialog({ onPostSelect }: AddTranslationDialogProps) {
  const [name, setName] = useState('');
  const { axios } = useClientAPI();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['me-posts', name],
    queryFn: () =>
      getMePosts(axios, {
        page: 0,
        name,
        tags: [],
        sort: 'time_1',
      }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => getPost(axios, { id }),
    onSuccess: (data) => onPostSelect(data),
  });

  function render() {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return <span>{error.message}</span>;
    }

    if (data?.length === 0) {
      return <NoResult />;
    }

    return data?.map(({ id, header }) => (
      <button
        className="flex items-start justify-start border border-border p-2 text-start rounded-md"
        key={id}
        title={header}
        onClick={() => mutate(id)}
      >
        {header.trim()}
      </button>
    ));
  }

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Add translation" variant="secondary">
          Translate a post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Select post</DialogTitle>
        <DialogDescription>Post to add translation to</DialogDescription>
        <div className="flex flex-col gap-2">
          <Search>
            <Search.Input
              placeholder="Post name"
              defaultValue={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <Search.Icon />
          </Search>
          <div className="flex flex-col gap-1">{render()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
