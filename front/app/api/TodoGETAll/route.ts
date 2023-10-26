import { NextResponse } from 'next/server';

export async function GET() {
// リクエストヘッダーにCORS関連の設定を追加
//  const headers = new Headers();
//  headers.append('Access-Control-Allow-Origin', '*'); 

  const response = await fetch('http://127.0.0.1:8000/v1/todo', {
    method: 'GET',
    // headers: headers
  });

  const data = await response.json();

  // レスポンスヘッダーにCORS関連の設定を追加
  // const corsHeaders = {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
  //   'Access-Control-Allow-Headers': 'Content-Type',
  // };

  // return NextResponse.json(data, { headers: corsHeaders });
  return NextResponse.json(data);
}
