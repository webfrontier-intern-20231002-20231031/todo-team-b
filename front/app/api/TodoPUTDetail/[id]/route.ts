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
    headers.append('Access-Control-Allow-Origin', '*'); 
    headers.append("Content-Type", "application/json");
  
    const id = params.id

    const body = await req.text();
    const Up = await JSON.parse(body)
    console.log(Up);
    let url = `http://127.0.0.1:8000/v1/todo/` + id;
  
    const res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(Up),
      headers: headers,
    });
  
    // レスポンスヘッダーにCORS関連の設定を追加
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, PUT',
    };
  
    const data = res.json();
    return Response.json(data);
}
  