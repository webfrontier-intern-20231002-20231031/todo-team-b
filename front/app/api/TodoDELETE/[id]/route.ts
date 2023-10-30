import { NextApiRequest } from "next";
import { useSearchParams } from "next/navigation";


export async function DELETE(request: NextApiRequest,
  { params }: { params: { slug: string }})
{

  // リクエストヘッダーにCORS関連の設定を追加
  const headers = new Headers();
  //必須
  headers.append('Access-Control-Allow-Origin', '*'); // これはテスト用の設定で、実際のプロダクション環境では '*' を使用しないでください。

  const id = params

  const res = await fetch(`http://127.0.0.1:8000/v1/todo/` + id, {
    method: 'DELETE',
    headers: headers,
  })

  // レスポンスヘッダーにCORS関連の設定を追加
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
  };

  const data = res.json();
  return Response.json(data);
}
