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

  await fetch('http://localhost:8000/v1/user/', {
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
  return response
}