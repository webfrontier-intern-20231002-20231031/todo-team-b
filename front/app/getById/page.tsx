"use client";

import TodoName from "./components/todoName";
import Deadline from "./components/deadline";
import GetTags from "./components/getTags";
import Delete from "./components/delete";
import Put from "./components/put";


export default function Home() {

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <TodoName/>
            <Deadline/>
            
        </div>
        <div className="float-right">
            <GetTags/>
        </div>
        <div>
            <Delete/>
            <Put/>  
        </div>
    </main>
  )
}