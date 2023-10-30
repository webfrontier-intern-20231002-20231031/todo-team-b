"use client";

import React, { useState, useEffect } from 'react';
import TodoGETName from "../Compornents/TableCompornents/TodoGETName";
import TagGETAll from "../Compornents/TableCompornents/TagGETAll";
import DELETEButton from "../Compornents/ButtonCompornents/DELETEButton";
import PUTButton from "../Compornents/ButtonCompornents/PUTButton";
import TodoGETDeadline from "../Compornents/TableCompornents/TodoGETDeadline";

interface Tag {
    id: number;
    name: string;
    todos: string; // 使わない
};

export default function TodoGetById() {

    const [tags, setTags] = useState<Tag[]>([]);
        useEffect(() => {
        // タグデータを取得する fetch リクエストを実行
        const fetchData = async () => {
            try {
            const response = await fetch("../../api/TagGETAll/");
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
    fetchData();
    }, []);

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