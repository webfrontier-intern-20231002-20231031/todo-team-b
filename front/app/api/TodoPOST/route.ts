import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // リクエストヘッダーにCORS関連の設定を追加
  const headers = new Headers();
  headers.append('Access-Control-Allow-Origin', '*'); // これはテスト用の設定で、実際のプロダクション環境では '*' を使用しないでください。

  await fetch('http://127.0.0.1:8000/v1/todo', {
    method: 'POST',
    body: JSON.stringify(req.body),
    headers: headers,
  })
  .then(res => res.json())
  .then(json => {
    console.log(json);
    // return res.status(200).json(json);
  })
  .catch(e => { console.error(e.message); });
  // res.end();

  // レスポンスヘッダーにCORS関連の設定を追加
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  return NextResponse.json({res, corsHeaders});
}
