import { NextApiRequest, NextApiResponse } from 'next';

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  // リクエストヘッダーにCORS関連の設定を追加
  const headers = new Headers();
  //必須
  headers.append('Access-Control-Allow-Origin', '*'); // これはテスト用の設定で、実際のプロダクション環境では '*' を使用しないでください。

  // console.log(req.body)
  const id = 7

  await fetch(`http://127.0.0.1:8000/v1/todo/${id}`, {
    method: 'DELETE',
    headers: headers,
  })
  .then(res => res.json())
  .then(json => {
    console.log(json);
  })
  .catch(e => { console.error(e.message); });

  // レスポンスヘッダーにCORS関連の設定を追加
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
  };

  return res.json({res, corsHeaders});
}
