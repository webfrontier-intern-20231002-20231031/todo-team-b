"use client";

import Post from "../formComponent/Post";
import UserList from "../formComponent/fetchTest";

export default function InputForm() {
    return (
        <main>
            {/* <div className= "flex justify-between"> */}
            <div style={{display: "flex"}}>
                <div>
                    <Post/>
                </div>

                <div>
                    <UserList />
                </div>
            </div>
        </main>
    )
}