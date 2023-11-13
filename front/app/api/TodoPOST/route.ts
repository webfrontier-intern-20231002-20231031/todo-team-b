import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

//export async function POST(req: NextApiRequest, res: NextApiResponse) {
export async function POST(req: Request, res: NextApiResponse) {
  // リクエストヘッダーにCORS関連の設定を追加
  const headers = new Headers();
  //必須
  headers.append("Content-Type", "application/json");
  headers.append('Access-Control-Allow-Origin', '*'); // これはテスト用の設定で、実際のプロダクション環境では '*' を使用しないでください。
  console.log(req.body)
  const data = await req.json();
  await fetch('http://127.0.0.1:8000/v1/todo', {
    cache: "no-store",
    method: 'POST',
    body: JSON.stringify(data),
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
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
  };

  return NextResponse.json({res, corsHeaders});
}

// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request, res: NextApiResponse) {
//   // リクエストヘッダーにCORS関連の設定を追加
//   const headers = new Headers();
//   // 必須
//   headers.append("Content-Type", "application/json");
//   headers.append('Access-Control-Allow-Origin', '*'); // これはテスト用の設定で、実際のプロダクション環境では '*' を使用しないでください。


//     const data = await req.json();
//     const apiResponse = await fetch('http://127.0.0.1:8000/v1/todo', {
//       cache: "no-store",
//       method: 'POST',
//       body: JSON.stringify(data),
//       headers: headers,
//     });

//     const responseData = await apiResponse.json();
//     console.log(responseData);

//     // レスポンスヘッダーにCORS関連の設定を追加
//     // const corsHeaders = {
//     //   'Access-Control-Allow-Origin': '*',
//     //   'Access-Control-Allow-Methods': 'POST, OPTIONS', // 必要に応じて他のHTTPメソッドも設定
//     // };

//     return NextResponse.json({ responseData });
// } 

