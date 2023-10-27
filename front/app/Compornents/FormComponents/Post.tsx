import React, { useState } from "react";

interface IPost {
    content: string;
    deadline: any;
    //compflg: boolean;
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
    //Postリクエスト発行の処理

    // type Todo = {
    //     completed: boolean;
    //     deadline: Date;
    //     id: number;
    //     content: string;
    //     tags: number[];
    // }

    // const [todos, settodos] = useState<Todo[] | null>(null);

    const time = "T23:59:59"

    const onSubmit = async (): Promise<void> => {
        const newPost: IPost = {
            content: content,
            deadline: deadline+time,
        };
        console.log(newPost)
        try {
            const res = await fetch('/api/TodoPOST',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPost),
            });
            //console.log(res)
        } catch (err){
            alert(err)
        }
    }

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
                        placeholder="期限を入力してください ex)2023-10-31"
                        value={deadline}
                        onChange={controllerInputChangeDeadline}
                    />
                </form>
            </div>
                <button className=" whitespace-pre-line bg-indigo-600 text-white px-4 py-2 rounded-md" type="submit">作成</button>
        </div>
    );
}
