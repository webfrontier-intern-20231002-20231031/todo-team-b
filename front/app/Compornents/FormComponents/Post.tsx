import React, { useState } from "react";

interface IPost {
  content: string; // タイトルからコンテンツへ変更
  deadline: string; // limitからDateTimeへ変更
  completed: boolean; // compflgからcompletedへ変更
}

export default function InputForm() {
  const [content, setContent] = useState<string>(""); // titleからcontentへ変更
  const [deadline, setdeadline] = useState<string>(""); // limitからDateTimeへ変更

  const controllerInputChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const controllerInputChangeDateTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setdeadline(e.target.value);
  };

  const controllerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: IPost = {
      content: content,
      deadline: deadline,
      completed: false,
    };

    // サーバーにPOSTリクエストを送信
    try {
      const response = await fetch("/api/TodoPOST", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        // 送信成功後にフォームのフィールドをリセット
        setContent("");
        setdeadline("");
      } else {
        // サーバーの応答が正しくない場合はエラーを処理
        console.error("データの送信に失敗しました");
      }
    } catch (error) {
      console.error("データの送信中にエラーが発生しました:", error);
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={controllerSubmit}>
          <h2>Todo名追加</h2>
          <input
            type="text"
            className="w-96 border-gray-300 rounded-md"
            placeholder="タスクを入力してください" // プレースホルダーを変更
            value={content}
            onChange={controllerInputChangeContent}
          />
          <h2>期限追加</h2>
          <input
            type="text"
            className="w-full border-gray-300 mt-10 px-7 py-8 rounded-md"
            placeholder="日時を入力してください ex)2023/12/31." // プレースホルダーを変更
            value={deadline}
            onChange={controllerInputChangeDateTime}
          />
        </form>
      </div>
      <button
        className="whitespace-pre-line bg-indigo-600 text-white px-4 py-2 rounded-md"
        type="submit"
      >
        作成
      </button>
    </div>
  );
}
