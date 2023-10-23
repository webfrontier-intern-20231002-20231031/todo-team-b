"use client";

import Post from "../formComponent/Post";
import PostAPI from "../formComponent/PostAPI";

export default function InputForm() {
    return (
        <main>
            {/* <div className= "flex justify-between"> */}
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                    <Post/>
                </div>

                <div>
                    
                </div>
            </div>
        </main>
    )
}