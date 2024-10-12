'use client';

import { revalidate } from '@/action/action';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { groupBy } from '@/lib/utils';
import { changeAuthorities, getAuthorities } from '@/query/authorities';
import { Authority, RoleWithAuthorities } from '@/types/response/Role';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckSquare, Square } from 'lucide-react';
import React, { Fragment, useMemo, useState } from 'react';

type Props = {
  role: RoleWithAuthorities;
};

export default function ChangeRoleAuthorityDialog({ role }: Props) {
  const { id: roleId, name, authorities } = role;

  const axios = useClientApi();
  const [open, setOpen] = useState(false);
  const [selectedAuthorities, setSelectedAuthorities] =
    useState<Authority[]>(authorities);

  const [isChanged, setIsChanged] = useState(false);
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const { data } = useQuery({
    queryFn: () => getAuthorities(axios),
    queryKey: ['authorities'],
    placeholderData: [],
  });

  const { mutate } = useMutation({
    mutationFn: async (authorityIds: string[]) =>
      changeAuthorities(axios, { roleId, authorityIds }),
    onSuccess: () => {
      invalidateByKey(['roles']);
      revalidate({ path: '/users' });
    },
    onError: (error) => {
      toast({
        title: 'error',
        variant: 'destructive',
        description: error.message,
      });
      setSelectedAuthorities(authorities);
    },
    mutationKey: ['update-role-authority', roleId],
  });

  function handleAuthorityChange(value: string[]) {
    const authority = value
      .map((v) => data?.find((r) => r.name === v))
      .filter((r) => r) as any as Authority[];

    setSelectedAuthorities(authority);
    setIsChanged(true);
  }

  function handleOpenChange(value: boolean) {
    if (value === false && isChanged) {
      mutate(selectedAuthorities.map((r) => r.id));
    }
    setOpen(value);
  }

  const groups = useMemo(
    () =>
      groupBy(
        data?.sort((a, b) =>
          a.authorityGroup.localeCompare(b.authorityGroup),
        ) || [],
        (v) => v.authorityGroup,
      ),
    [data],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="overflow-hidden text-ellipsis">
        <section className="space-x-2">
          {selectedAuthorities.length ? (
            selectedAuthorities.map(({ id, name }) => (
              <span key={id}>{name}</span>
            ))
          ) : (
            <span>Add authority</span>
          )}
        </section>
      </DialogTrigger>
      <DialogContent className="h-full overflow-y-auto p-6">
        <DialogTitle>Change authority for {name}</DialogTitle>
        <DialogDescription />
        {groups.map(({ key, value }) => (
          <Fragment key={key}>
            <span className="font-bold">{key}</span>
            <ToggleGroup
              className="flex flex-col items-start justify-start gap-4"
              type={'multiple'}
              onValueChange={handleAuthorityChange}
              defaultValue={authorities.map((r) => r.name)}
            >
              {value.map(({ id, name, description }) => (
                <ToggleGroupItem
                  key={id}
                  className="w-full justify-start space-x-2 p-1 px-0 capitalize hover:bg-transparent data-[state=on]:bg-transparent"
                  value={name}
                >
                  <div className="w-full space-y-1">
                    <div className="flex w-full justify-between gap-1">
                      <span className="text-sm">{name}</span>
                      {selectedAuthorities.map((r) => r.id).includes(id) ? (
                        <CheckSquare className="size-5" />
                      ) : (
                        <Square className="size-5" />
                      )}
                    </div>
                    <p className="text-start text-xs">{description}</p>
                  </div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Fragment>
        ))}
      </DialogContent>
    </Dialog>
  );
}
