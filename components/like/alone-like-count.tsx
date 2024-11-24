import { LikeIcon } from '@/components/common/icons';

import { useLike } from '@/context/like-context';
import { cn } from '@/lib/utils';

export default function AloneLikeCount() {
  const { count } = useLike();

  return (
    <div
      className={cn('flex h-9 min-w-9 gap-2 transition-colors items-center justify-center rounded-md border border-border text-base', {
        'text-destructive hover:text-destructive': count < 0,
        'text-success hover:text-success': count > 0,
      })}
      title="like-count"
    >
      <LikeIcon className="size-[1.25rem]" />
      <span>{count}</span>
    </div>
  );
}
