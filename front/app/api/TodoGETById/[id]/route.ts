export const fetchCache = 'default-no-store';

export async function GET({ params }:{params: {id : string}})
{
  const id = params.id

  const headers = new Headers();
    //必須
    headers.append('Access-Control-Allow-Origin', '*');
    let url = `http://127.0.0.1:8000/v1/todo/` + id;

  const res = await fetch(url, {
        method: 'GET',
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

