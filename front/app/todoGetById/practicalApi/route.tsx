import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('http://localhost:8000/v1/tag');
  const data = await response.json();
  return NextResponse.json(data);
}