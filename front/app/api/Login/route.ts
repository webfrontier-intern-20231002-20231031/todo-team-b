import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: Request) {

    console.log("<<< test >>>")
    const body = await req.text();
    console.log(body);
    const res_js = await JSON.parse(body)
    console.log(res_js.email)

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    await fetch('http://localhost:8000/v1/user/login', {
        method: 'POST',
        body: JSON.stringify(res_js),
        headers: headers,
    })
    .then(res => res.json())
    .then(json => {
    console.log(json);
    })
    .catch(e => { console.error(e.message); });
    return NextResponse.json({ text: 'Hello' });
}
