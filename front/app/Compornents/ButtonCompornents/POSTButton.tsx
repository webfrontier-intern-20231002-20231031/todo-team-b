import React, {useState} from "react";
import { useRouter } from "next/navigation";

interface TagPost{
    name: string;
}

interface Redirect{
    data: string;
}
  
export default function PostTags() {
    const [name, setName] = useState<string>("");
    const [data, setData] = useState<Redirect[]>([])
    const controllerInputChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const router = useRouter();

    const redirect = async () => {
        adding();
        router.refresh();
    }

    const fetchData = async () => {
        try {
          const response = await fetch('/api/TagGETAll',{
            cache: "no-store",
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data: Redirect[] = await response.json();
    
          // 取得したデータをコンポーネントの状態にセット
          setData(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }

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
        //fetchData();
        //redirect();
        setName("");
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
                        className="w-96 border-gray-300 rounded-md" 
                        placeholder="新規Tag名を入力してください" 
                        value={name} 
                        onChange={controllerInputChangeName}
                        />
                </form>
            </div>
            <div>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-20 m-5" type="button" 
                onClick={() => {
                    adding();
                    //fetchData();
                    router.push("/Tags");
                    router.refresh();
                }}>追加</button>
            </div>
        </div>
    )
}