import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';

type CopyProps = {
  data: string;
  title?: string;
  content?: string;
};

let dismissLast: (() => void) | null = null;

export default function useClipboard() {
  const { toast } = useToast();
  const t = useI18n();

  return async ({ data, title = t('copied'), content = '' }: CopyProps) => {
    await navigator.clipboard.writeText(data);
    if (dismissLast) dismissLast();
    const { dismiss } = toast({
      title: title,
      description: content,
    });
    dismissLast = dismiss;
    return dismiss;
  };
}
