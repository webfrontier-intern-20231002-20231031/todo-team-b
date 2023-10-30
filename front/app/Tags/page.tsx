"use client";

import DELETEButton from "../Compornents/ButtonCompornents/DELETEButton";
import TagGETAll from "../Compornents/TableCompornents/TagGETAll";
import PUTButton from "../Compornents/ButtonCompornents/PUTButton";
import POSTButton from "../Compornents/ButtonCompornents/POSTButton";



export default function Tags() {

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

        <div className="">
            <div className="w-full m-5">
                <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
                    <TagGETAll/>
                </div>
                <div className="text-right">
                
                    <POSTButton/>
                </div>
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