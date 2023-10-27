import { NextRequest, NextResponse } from 'next/server';

export default async function DELETE(req: NextRequest): Promise<NextResponse> {

    if (req.body !== null) {
      // リクエストボディをJSONとしてパース
      const requestBody = await req.text();
      const parsedBody = JSON.parse(requestBody);

      if (parsedBody && parsedBody.id !== undefined && parsedBody.completed !== undefined) {
        const id = parsedBody.id; // クライアントからタスクIDを受け取る
        // リクエストヘッダーにCORS関連の設定を追加
        const headers = new Headers();
        headers.append('Content-Type','application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        // FastAPIにDELETEリクエストを送信し、idに対応するTodoを削除
        const response = await fetch(`http://localhost:8000/v1/todo/${id}`, {
          method: 'DELETE',
          headers: headers,
        });

        if (response.ok) {
          // レスポンスヘッダーにCORS関連の設定を追加
          const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, DELETE, POST',
          };
          return NextResponse.json({ message: 'Task status updated successfully' }, { status: 200, headers: corsHeaders });
        } else {
          return NextResponse.json({ error: 'Task status update failed' }, { status: response.status });
        }
      }
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}