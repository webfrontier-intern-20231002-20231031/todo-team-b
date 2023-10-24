import React, {useState} from "react";

interface IPost {
    task: string;
    //content: string;
    deadline: string;
    compflg: boolean;
}

export default function InputForm() {
    const [title, setTitle] = useState<string>("");
    //const [detail, setDetail] = useState<string>("");
    const [limit, setLimit] = useState<string>("");
    const [post, setPost] = useState<IPost[]> ([]);

    const controllerInputChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const controllerInputChangeLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(e.target.value);
    }

    const controllerSubmit = (e: React.FormEvent) => {
        e.preventDefault;
        const newPost: IPost = {
            task: title,
            //content: detail,
            deadline: limit,
            compflg: false
        };

        setPost(prePost => [...prePost, newPost]);
        setTitle("");
        setLimit("");
    };

    return (
        <div>
            <div>
                <form onSubmit={controllerSubmit}>
                    {/* input要素がフォームの入力欄を表す */}
                    <h2>Todo名追加</h2>
                    <input
                    //textと指定することでフォームの入力欄がテキスト入力用であることを指定
                        type="text"
                        //classNameはCSSのクラス名を指定する
                        className="w-96 border-gray-300 rounded-md"
                        placeholder="タスクを入力してください"
                        value={title}
                        onChange={controllerInputChangeTitle}
                    />
                    <h2>期限追加</h2>
                    <input
                    //textと指定することでフォームの入力欄がテキスト入力用であることを指定
                        type="text"
                        //classNameはCSSのクラス名を指定する
                        className="w-full border-gray-300 mt-10 px-7 py-8 rounded-md"
                        placeholder="期限を入力してください ex)2023/12/31."
                        value={limit}
                        onChange={controllerInputChangeLimit}
                    />
                </form>
            </div>
                <button className=" whitespace-pre-line bg-indigo-600 text-white px-4 py-2 rounded-md" type="submit">作成</button>
        </div>
    );
}