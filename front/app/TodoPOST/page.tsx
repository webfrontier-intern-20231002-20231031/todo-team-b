"use client";

import Post from "../Compornents/FormComponents/Post";
import React, { useState, useEffect } from 'react';

interface Tag {
    id: number;
    name: string;
    todos: string;
};
interface Props {
    width : string
}

export default function InputForm() {

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
                    <Post />
                </div>

                <div className="w-full m-5">
                    <h1 className="text-lg font-bold">タグ一覧</h1>
                    <ul>
                        {tags.map((tag) => (
                        <li key={tag.id}>{tag.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    )
}