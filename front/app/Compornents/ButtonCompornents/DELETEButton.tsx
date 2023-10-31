// const DELETEButton = () => {
//     return <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-20 m-5">削除</button>
// };

import React, { useState } from "react";
import { getSystemErrorName } from "util";

  
// export default DELETEButton;


interface DeleteTarget{
    id : string;
}

export default function DeleteTag(){
    const [id, setId] = useState<string>("");

    const controllerInputChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setId(e.target.value);
    };

    const deleting = async (): Promise<void> => {
        const newTarget: DeleteTarget = {
            id : id,
        };
        console.log(newTarget)
        try {
            const res = await fetch(`/api/TagDELETE/${newTarget.id}`,{
                method: "DELETE",
            });
        } catch(err){
            alert(err)
        }
        setId("");
        location.reload();
    }
    return (
        <div>
            {/* <h2>Tag名追加</h2> */}
            <div>
                <form>
                    <h2>Tagの新規追加</h2>
                    <input 
                        type="text" 
                        className="w-1/12 border-gray-300 rounded-md" 
                        placeholder="削除するIDを入力" 
                        value={id} 
                        onChange={controllerInputChangeId}
                        />
                </form>
            </div>
            <div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-20 m-5" type="button" 
                onClick={() => {
                    deleting();
                    //fetchData();
                }}>削除</button>
            </div>
        </div>
    )
}