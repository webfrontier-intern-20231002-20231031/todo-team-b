"use client";

import React, { useState, useEffect } from 'react';

import DELETEButton from "../../Compornents/ButtonCompornents/DELETEButton";
import PUTButton from "../../Compornents/ButtonCompornents/PUTButton";

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

export default function TodoGETById({ params }: { params: { id: number } }) {

    const id = params.id
    console.log(id)
    //GETTodo
    const [todos, setTodos] = useState<Todo[]>([]);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('/api/TodoGETAll');
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: Todo[] = await response.json();
      
            const todoToDisplay = data.find((todo) => todo.id === id);
            setSelectedTodo(todoToDisplay || null);
          } catch (error) {
            console.error('Error:', error);
          }
        }
      
        fetchData();  // fetchDataをuseEffect内で呼び出す
      
      }, [id]); // idを依存関係の配列に含める

    useEffect(() => {
        // 指定したIDに一致するTodoデータを抽出
        const todoToDisplay = todos.find((todo) => todo.id === id);
        setSelectedTodo(todoToDisplay || null); // 見つからない場合はnullをセット
        console.log(todoToDisplay)
      }, [id, todos]);

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
                {selectedTodo ? (
                    <div>
                    <h2>Todo Details</h2>
                    <p>ID: {selectedTodo.id}</p>
                    <p>Content: {selectedTodo.content}</p>
                    <p>Deadline: {selectedTodo.deadline ? new Date(selectedTodo.deadline).toLocaleString() : 'なし'}</p>
                    <p>Status: {selectedTodo.completed ? '完了' : '未完了'}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
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