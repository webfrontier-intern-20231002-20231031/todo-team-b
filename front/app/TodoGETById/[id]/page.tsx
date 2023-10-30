"use client";

import React, { useState, useEffect } from 'react';

import TodoGETName from "../../Compornents/TableCompornents/TodoGETName";
import DELETEButton from "../../Compornents/ButtonCompornents/DELETEButton";
import PUTButton from "../../Compornents/ButtonCompornents/PUTButton";
import TodoGETDeadline from "../../Compornents/TableCompornents/TodoGETDeadline";

interface Todo {
    id: number;
    content: string;
    deadline: Date | null; // deadlineがnullの場合を考慮
    completed: boolean;
}

interface Tag {
    id: number;
    name: string;
    todos: string; // 使わない
};

export default function TodoGetById({ params }: { params: { id: number } }) {

    const taskid = params.id
    //GETTodo
    const [todo, setTodo] = useState<Todo[]>([]);
    
    const fetchData = async () => {
        try {
          const response = await fetch(`/api/TodoGETById/${taskid}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data: Todo[] = await response.json();
    
          // 取得したデータをコンポーネントの状態にセット
          setTodo(data);
          console.log(data)
        } catch (error) {
          console.error('Error:', error);
        }
      }
    
      // fetchDataをuseEffect内に移動して、コンポーネントがマウントされた時に実行
      useEffect(() => {
        fetchData();
      }, []);
    // const targetTodo = todo.find((todo) => todo.id === TodoId);

    //GETTag
    const [tags, setTags] = useState<Tag[]>([]);
    useEffect(() => {
        // タグデータを取得する fetch リクエストを実行
        const fetchTags = async () => {
            try {
                const response = await fetch("../api/TagGETAll");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data: Tag[] = await response.json();
                setTags(data);
            } catch (error) {
                // エラーハンドリング
                console.error("Error fetching data:", error);
            }
        };
        fetchTags();
    }, []);

    
    return (
        <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

            <div className="flex justify-between">
                <div className="w-full m-5">
                    {/* <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
                        {targetTodo ? (   
                            // id={TodoId}:は確認用、後で消して良い
                            <p>id={TodoId}: {targetTodo.content}</p>
                        ) : (
                            //最初読み込みで出る、消して良い
                            <p>Todo not found for id {TodoId}</p>
                        )}
                    </div>
                    <div>
                    {targetTodo ? (   
                            // id={TodoId}:は確認用、後で消して良い
                            <p>id={TodoId}: {targetTodo.deadline? new Date(targetTodo.deadline).toLocaleString() : 'なし'}</p>
                        ) : (
                            <p>Todo not found for id {TodoId}</p>
                        )}
                    </div>
                    <div>
                    {targetTodo ? (   
                            // id={TodoId}:は確認用、後で消して良い
                            <p>id={TodoId}: {targetTodo.completed ? '完了' : '未完了'}</p>
                        ) : (
                            <p>Todo not found for id {TodoId}</p>
                        )}
                    </div> */}
                </div>
                <div className="w-full m-5">
                    <div className="max-w-md mx-auto rounded-lg shadow-md overflow-hidden">
                        <div>
                            <h1 className="text-lg font-bold">タグ一覧</h1>
                            <ul>
                                {tags.map((tag) => (
                                <li key={tag.id}>{tag.name}</li>
                                ))}
                            </ul>
                        </div>
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