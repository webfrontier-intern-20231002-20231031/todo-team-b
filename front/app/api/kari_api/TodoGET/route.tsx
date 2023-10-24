import { NextResponse } from 'next/server';

/* 使ってない */
export async function GET() {
  const response = await fetch('http://127.0.0.1:8000/v1/todo/1');
  const data = await response.json();
  return NextResponse.json(data);
}