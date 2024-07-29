import { useSearchParams } from 'next/navigation';
import { z } from 'zod';

import { QuerySchema } from '@/query/query';

const groupParamsByKey = (params: URLSearchParams) =>
  params.entries().reduce<Record<string, any>>((acc, tuple) => {
    const [key, val] = tuple;
    if (acc.hasOwnProperty(key)) {
      if (Array.isArray(acc[key])) {
        acc[key] = [...acc[key], val];
      } else {
        acc[key] = [acc[key], val];
      }
    } else {
      acc[key] = val;
    }

    return acc;
  }, {});

export default function useSearchQuery<T extends QuerySchema>(
  schema: T,
): z.infer<typeof schema> {
  const query = useSearchParams();
  const data = groupParamsByKey(query);

  const result = schema.parse(data);

  return result;
}
