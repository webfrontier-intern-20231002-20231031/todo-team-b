"use client";
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return new Response(null, { status: 400, statusText: "Must be POST method" });
    }

    await fetch("https://jsonplaceholder.typicode.com/posts/", {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then(res => res.json())
        .then(json => {
        console.log(json);
        return res.status(200).json(json);
        })
        .catch(e => { console.error(e.message); });

    res.end();
}