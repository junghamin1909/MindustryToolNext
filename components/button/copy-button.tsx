'use client';

import { VariantProps, cva } from 'class-variance-authority';
import { Copy } from 'lucide-react';
import React, { ReactNode } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

import useClipboard from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';

import { useMutation } from '@tanstack/react-query';

const copyButtonVariants = cva('p-2 hover:bg-brand bg-transparent group/copy-button', {
  variants: {
    variant: {
      default: 'border border-border',
      ghost: '',
    },
    position: {
      relative: '',
      absolute: 'absolute left-1 top-1 aspect-square',
    },
  },
  defaultVariants: {
    variant: 'default',
    position: 'relative',
  },
});

export type CopyButtonProps = VariantProps<typeof copyButtonVariants> &
  Omit<ButtonProps, 'title'> & {
    title?: ReactNode;
    content?: ReactNode;
    data: string | (() => Promise<string>);
  };
export default function CopyButton({ className, title, content, data, children, variant, position, ...props }: CopyButtonProps) {
  const copy = useClipboard();

  const { mutate } = useMutation({
    mutationFn: async () => (data instanceof Function ? await data() : data),
    onSuccess: (data) => {
      copy({ data, title, content });
    },
  });

  async function handleClick() {
    mutate();
  }

  return (
    <Button className={cn(copyButtonVariants({ className, variant, position }))} title="copy" variant="ghost" {...props} onClick={handleClick}>
      {children ?? <Copy className="size-5 text-foreground group group-hover/copy-button:text-background dark:group-hover/copy-button:text-foreground" strokeWidth="1.5px" />}
    </Button>
  );
}
