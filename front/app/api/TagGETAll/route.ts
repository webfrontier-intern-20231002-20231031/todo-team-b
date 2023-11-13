import { NextRequest, NextResponse } from 'next/server';
import { auth_jwt } from '../auth';

// export async function GET() {
//   const response = await fetch('http://127.0.0.1:8000/v1/tag',{
//     cache: "no-store",
//     method: 'GET',
//   });
//   const data = await response.json();
//   return NextResponse.json(data);
// }
const headers = new Headers();
headers.append('Access-Control-Allow-Origin', '*'); 

export async function GET(req: NextRequest) {
  const res_auth = await auth_jwt(req)
  if (!res_auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401});
  }
  const response = await fetch('http://127.0.0.1:8000/v1/tag',{
    cache: "no-store",
    method: 'GET',
  });
  const data = await response.json();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
    'Access-Control-Allow-Headers': '*',
  };

  return NextResponse.json(data, { headers: corsHeaders });
}