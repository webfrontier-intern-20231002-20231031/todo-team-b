import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return NextResponse.json(data);
}