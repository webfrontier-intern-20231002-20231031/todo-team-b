import React, {useState} from "react";

interface TagPost{
    name: string;
}

// const POSTButton = () => {
//     return <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-20 m-5">追加</button>
// };
  
export default function PostTags() {
    const [name, setName] = useState<string>("");

    const controllerInputChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const adding = async (): Promise<void> => {
        const newTag: TagPost = {
            name: name,
        };
        console.log(newTag)
        try {
            const res = await fetch('/api/TagPOST',{
                cache: "no-store",
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(newTag),
            });
        } catch(err){
            alert(err)
        }
    }
    
    return (
        <div>
            {/* <h2>Tag名追加</h2> */}
            <div>
                <form>
                    <h2>Tagの新規追加</h2>
                    <input 
                        type="text" 
                        className="w-96 border-gray-300 rounded-md" 
                        placeholder="新規Tag名を入力してください" 
                        value={name} 
                        onChange={controllerInputChangeName}
                        />
                </form>
            </div>
            <div>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-20 m-5" type="submit" onClick={adding}>追加</button>
            </div>
        </div>
    )
}