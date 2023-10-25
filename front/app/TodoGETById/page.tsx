// "use client";

import TodoGETName from "../Compornents/TableCompornents/TodoGETName";
import TagGETAll from "../Compornents/TableCompornents/TagGETAll";
import DELETEButton from "../Compornents/ButtonCompornents/DELETEButton";
import PUTButton from "../Compornents/ButtonCompornents/PUTButton";
import TodoGETDeadline from "../Compornents/TableCompornents/TodoGETDeadline";


export default function TodoGetById() {

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

        <div className="flex justify-between">
            <div className="w-full m-5">
                <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
                <TodoGETName/>
                </div>
                <TodoGETDeadline/>
            </div>
            <div className="w-full m-5">
                <TagGETAll/>
            </div>
        </div>
        <div className="text-center">
            <div>
                <DELETEButton/>
                <PUTButton/>
            </div>
        </div>
        
    </main>
  )
}