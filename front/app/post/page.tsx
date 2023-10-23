"use client";

import Post from "../formComponent/Post";
import UserList from "../formComponent/fetchTest";

interface Props {
    width : string
}

export default function InputForm() {
    return (
        <main>
            {/* <div className= "flex justify-between"> */}
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{width: "50%;"}}>
                    <Post/>
                </div>

                <div style={{width: "50%"}}>
                    <h2>Tag一覧</h2>
                    <UserList />
                </div>
            </div>
        </main>
    )
}