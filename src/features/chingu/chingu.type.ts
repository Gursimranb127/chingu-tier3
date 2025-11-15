import { Prisma, Chingu } from '@prisma/client';

export type ChinguOrderByInput = Prisma.ChinguOrderByWithRelationInput;
export type ChinguWhereInput = Prisma.ChinguWhereInput;
export type ChinguType = Chingu;

export interface ChinguQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: ChinguOrderByInput;
  where?: ChinguWhereInput;
}
