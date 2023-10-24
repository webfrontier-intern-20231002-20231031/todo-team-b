"use client";

import Delete from "../todoGetById/components/delete";
import GetTags from "../todoGetById/components/getTags";
import Put from "../todoGetById/components/put";
import PostTag from "./postTag";


export default function TagGetAll() {

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

        <div className="">
            <div className="w-full m-5">
                <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
                    <GetTags/>
                </div>
                <div className="text-right">
                
                    <PostTag/>
                </div>
            </div>
        </div>
        <div className="text-center">
            <div>
                <Delete/>
                <Put/>
            </div>
        </div>
        
    </main>
  )
}