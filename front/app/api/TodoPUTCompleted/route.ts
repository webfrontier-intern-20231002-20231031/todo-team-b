import { NextRequest, NextResponse } from 'next/server';

export default async function PUT(req: NextRequest): Promise<NextResponse> {

    if (req.body !== null) {
      // リクエストボディをJSONとしてパース
      const requestBody = await req.text();
      const parsedBody = JSON.parse(requestBody);

      if (parsedBody && parsedBody.id !== undefined && parsedBody.completed !== undefined) {
        const id = parsedBody.id; // クライアントからタスクIDを受け取る
        const completed = parsedBody.completed; // クライアントの完了状態と逆の状態を受け取る(現在がTrueならFalseを受け取る)

        // FastAPIにPUTリクエストを送信し、completedを切り替え
        const response = await fetch(`http://localhost:8000/v1/todo/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ completed }), // 受け取ったcompletedの値を設定
        });

        if (response.ok) {
          // レスポンスヘッダーにCORS関連の設定を追加
          const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, PUT, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          };
          return NextResponse.json({ message: 'Task status updated successfully' }, { status: 200, headers: corsHeaders });
        } else {
          return NextResponse.json({ error: 'Task status update failed' }, { status: response.status });
        }
      }
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
