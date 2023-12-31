import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {

  const body = await req.text();
  console.log(body);
  const res_js = await JSON.parse(body)
  console.log(res_js.email)

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  let responseStatus
  let responseUserId

  await fetch('http://localhost:8000/v1/user/login', {
      method: 'POST',
      body: JSON.stringify(res_js),
      headers: headers,
  })
  .then(res => {
      responseStatus = res.status;
      return res.json();
  })
  .then(json => {
    responseUserId = json
  })
  .catch(error => {
    console.error('server side error : ', error)
  })
  console.log(responseStatus)

  const response = NextResponse.json({},{ status: responseStatus })

  if (300 > responseStatus) {
    const secretKey = String(process.env.SECRET_KEY);

    const payload = {
      user_id: responseUserId
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '10h' });

    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 10       // ブラウザ上では世界標準時間で表示されるので注意(ちゃんと指定した時間分消えないので大丈夫)
    })
  }
  return response
}