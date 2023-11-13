import { NextRequest, NextResponse } from 'next/server';
import { auth_jwt } from '../../auth';

export async function PUT(req: NextRequest,
  { params }:{params: {id : string}}){

  const res_auth = await auth_jwt(req)
  if (!res_auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401});
  }

  // リクエストヘッダーにCORS関連の設定を追加
  const headers = new Headers();
  //必須
  headers.append('Access-Control-Allow-Origin', '*'); 
  headers.append("Content-Type", "application/json");

  const id = params.id

  // const flg = Boolean(req.json)

  const body = await req.text();
  console.log(body);
  const comp = await JSON.parse(body)
  let url = `http://127.0.0.1:8000/v1/todo/` + id;

    // FastAPIにPUTリクエストを送信し、completedを切り替え
  const res = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(comp), // 受け取ったcompletedの値を設定
    headers: headers,
  });

    //       // レスポンスヘッダーにCORS関連の設定を追加
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, PUT',
  };

  const data = res.json();
  // return res.json({res, corsHeaders});
  return Response.json(data);

}
