"use client";

import Post from "../Compornents/FormComponents/Post";

interface Props {
    width : string
}

export default function InputForm() {
    return (
        <main>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{width: "50%;"}}>
                    <Post />
                </div>

                <div style={{width: "50%"}}>
                    <h2>Tag一覧</h2>

                </div>
            </div>
        </main>
    )
}