import { NextRequest, NextResponse } from 'next/server';
import { chinguController } from '@/features/chingu/chingu.controller';
import { ChinguQueryOptions } from '@/features/chingu/chingu.type';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const countryCode = searchParams.get('code')?.trim();
  const countryName = searchParams.get('name')?.trim();
  const limit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit')!)
    : undefined;
  const offset = searchParams.get('offset')
    ? parseInt(searchParams.get('offset')!)
    : undefined;
  const orderBy = searchParams.get('orderBy');

  try {
    const options: ChinguQueryOptions = {};

    if (countryCode || countryName) {
      options.where = {};
      if (countryCode) {
        options.where.countryCode = {
          equals: countryCode,
          mode: 'insensitive',
        };
      }
      if (countryName) {
        options.where.countryName = {
          equals: countryName,
          mode: 'insensitive',
        };
      }
    }

    if (limit !== undefined) {
      options.limit = limit;
    }

    if (offset !== undefined) {
      options.offset = offset;
    }

    if (orderBy) {
      options.orderBy = JSON.parse(orderBy);
    }

    const data = await chinguController.list(options);
    return NextResponse.json(data);
  } catch (e) {
    const err = e as Error;
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
