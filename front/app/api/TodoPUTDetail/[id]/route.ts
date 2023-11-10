export async function PUT(req: Request,
    { params }:{params: {id : string}}){
    // リクエストヘッダーにCORS関連の設定を追加
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*'); 
    headers.append("Content-Type", "application/json");
  
    const id = params.id
  
    const Up= await req.json();
  
    console.log(Up)
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
  