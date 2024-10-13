import { AxiosInstance } from 'axios';

export async function getLogCollections(
  axios: AxiosInstance,
): Promise<string[]> {
  const result = await axios.get(`logs`);

  return result.data;
}

import { LogType } from '@/constant/enum';
import Pageable from '@/types/data/pageable-schema';
import { Log } from '@/types/response/Log';

type GetLogParams = Pageable & {
  collection: LogType;
  env?: 'Prod' | 'Dev';
};

export async function getLogs(
  axios: AxiosInstance,
  { collection, page, ...rest }: GetLogParams,
): Promise<Log[]> {
  const params = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value),
  );

  const result = await axios.get(`logs/${collection}`, {
    params: {
      size: 20,
      page,
      ...params,
    },
  });

  return result.data;
}

export async function getLogCount(
  axios: AxiosInstance,
  {
    collection,
    ...rest
  }: {
    env?: string;
    ip?: string;
    userId?: string;
    url?: string;
    content?: string;
    before?: string;
    after?: string;
    collection: LogType;
  },
): Promise<number> {
  const params = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value),
  );

  const result = await axios.get(`logs/${collection}/count`, {
    params: {
      ...params,
    },
  });

  return result.data;
}
