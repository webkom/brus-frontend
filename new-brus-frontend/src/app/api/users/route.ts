import { NextResponse } from 'next/server';

type User = {
  name: string;
  saldo: number;
  picture: string;
};

export async function GET(req: Request) {
  const Jenny: User = {
    name: 'jenny',
    saldo: 1000,
    picture:
      'https://avatars.githubusercontent.com/u/113467867?s=400&u=e10a066249f24772c546c358be6ee9bcac4b8461&v=4',
  };

  const Falk: User = {
    name: 'falk',
    saldo: -100,
    picture: 'https://avatars.githubusercontent.com/u/66320400?v=4',
  };

  const users = [Jenny, Falk];
  return new NextResponse(JSON.stringify(users));
}
