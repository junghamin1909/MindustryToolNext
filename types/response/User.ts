import { Role } from '@/types/response/Role';

export type UserId = '@me' | string;
export type User = {
  id: string;
  name: string;
  imageUrl?: string | null;
  roles: Role[];
};
