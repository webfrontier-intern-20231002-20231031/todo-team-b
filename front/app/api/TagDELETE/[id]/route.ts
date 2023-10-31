import { NextApiRequest } from 'next';

export async function DELETE(req: NextApiRequest,
  { params }:{params: {id : string}}){
  const id = params.id
  // リクエストヘッダーにCORS関連の設定を追加
  const headers = new Headers();
  //必須
  headers.append('Access-Control-Allow-Origin', '*'); // これはテスト用の設定で、実際のプロダクション環境では '*' を使用しないでください。

  console.log(id)
  let url = `http://127.0.0.1:8000/v1/tag/` + id;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: headers,
  })

  // レスポンスヘッダーにCORS関連の設定を追加
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
  };

  const data = res.json();
  // return res.json({res, corsHeaders});
  return Response.json(data);
}