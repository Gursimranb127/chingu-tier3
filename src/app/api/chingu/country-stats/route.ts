import { NextRequest, NextResponse } from 'next/server';
import { chinguController } from '@/features/chingu/chingu.controller';

export async function GET(req: NextRequest) {
  try {
    const data = await chinguController.countryStats();
    return NextResponse.json(data);
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
