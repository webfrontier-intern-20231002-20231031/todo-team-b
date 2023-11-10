import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {

  console.log("<<< test >>>")
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
    console.log("server side success : ", json)
    responseUserId = json
  })
  .catch(error => {
    console.error('server side error : ', error)
  })
  console.log(responseStatus)

  const response = NextResponse.json({ status: responseStatus })

  if (300 > responseStatus) {
    const secretKey = 'your-secret-key';  // .envに書き込む

    const payload = {
      user_id: responseUserId
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    response.cookies.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}`);
  }
  return response
}