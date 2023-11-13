import { NextRequest, NextResponse } from 'next/server';
import { auth_jwt } from '../../auth';

export async function DELETE(req: NextRequest,
  { params }:{params: {id : string}}){

  // 認可機能
  const res_auth = await auth_jwt(req)
  if (!res_auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401});
  }

  const id = params.id
  // リクエストヘッダーにCORS関連の設定を追加
  const headers = new Headers();
  //必須
  headers.append('Access-Control-Allow-Origin', '*'); // これはテスト用の設定で、実際のプロダクション環境では '*' を使用しないでください。

  console.log(id)
  let url = `http://127.0.0.1:8000/v1/todo/` + id;

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
