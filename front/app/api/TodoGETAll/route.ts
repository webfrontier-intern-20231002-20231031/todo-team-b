import { NextResponse } from 'next/server';

export const fetchCache = 'default-no-store';

export async function GET() {
// リクエストヘッダーにCORS関連の設定を追加
 const headers = new Headers();
 headers.append('Access-Control-Allow-Origin', '*'); 

  const response = await fetch('http://127.0.0.1:8000/v1/todo', {
    method: 'GET',
    headers: headers, // 上で設定したヘッダーを使ってリクエストを送信
  });

  const data = await response.json();

  // レスポンスヘッダーにCORS関連の設定を追加
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://3000',
    'Access-Control-Allow-Methods': 'GET, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
  };

  return NextResponse.json(data, { headers: corsHeaders });
  // return NextResponse.json(data);
}
