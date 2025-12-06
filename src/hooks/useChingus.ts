import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { ChinguOrderByInput } from '@/features/chingu/chingu.type';

interface UseChingusParams {
  countryCode?: string;
  countryName?: string;
  limit?: number;
  offset?: number;
  orderBy?: ChinguOrderByInput;
}

export const useChingus = ({
  countryCode,
  countryName,
  limit,
  offset,
  orderBy,
}: UseChingusParams = {}) => {
  const code = countryCode?.trim();
  const name = countryName?.trim();

  const params: Record<string, string | number> = {};

  if (code) params.code = code;
  if (name) params.name = name;
  if (limit !== undefined) params.limit = limit;
  if (offset !== undefined) params.offset = offset;
  if (orderBy) params.orderBy = JSON.stringify(orderBy);

  return useQuery({
    queryKey: [
      'chingus',
      code ?? null,
      name ?? null,
      limit ?? null,
      offset ?? null,
      orderBy ?? null,
    ],
    retry: false,
    queryFn: async () => {
      const response = await axiosInstance.get('/chingu', {
        params,
      });
      return response.data;
    },
  });
};
