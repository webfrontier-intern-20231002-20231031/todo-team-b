"use client";

import TodoName from "./components/todoName";
import Deadline from "./components/deadline";
import GetTags from "./components/getTags";
import Delete from "./components/delete";
import Put from "./components/put";


export default function TodoGetById() {

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

        <div className="flex justify-between">
            <div className="w-full m-5">
                <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
                <TodoName/>
                </div>
                <Deadline/>
            </div>
            <div className="w-full m-5">
                <GetTags/>
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