import { NextResponse } from 'next/server';

type User = {
  name: string;
  saldo: number;
};

export async function GET(req: Request) {
  const Jenny: User = {
    name: 'jenny',
    saldo: 1000,
  };

  const Falk: User = {
    name: 'falk',
    saldo: 999,
  };

  const users = [Jenny, Falk];
  return new NextResponse(JSON.stringify(users));
}
