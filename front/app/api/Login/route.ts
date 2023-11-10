import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: Request) {

    console.log("<<< test >>>")
    const body = await req.text();
    console.log(body);
    const res_js = await JSON.parse(body)
    console.log(res_js.email)

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    let responseStatus
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
    })
    .catch(error => {
      console.error('server side error : ', error)
    })
    console.log(responseStatus)
    return NextResponse.json({ status: responseStatus });
}
