"use client";
import { todo } from 'node:test';
import React, { useState, useEffect } from 'react';

interface Todo {
  content: string;
  deadline: Date;
  completed: boolean;
}

function Home() {
  const [searchText, setSearchText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);

  // サンプルデータ
  const sampleData: Todo[] = [
    {
      content: "ミルクを買う",
      deadline: new Date("2023-10-20T23:59:59"),
      completed: true,
    },
    {
      content: "アイスブレイク",
      deadline: new Date("2023-10-19T23:59:59"),
      completed: true,
    },
    {
      content: "豆腐を買う",
      //10/23 12:37nullだとエラーが出るため、アイスブレイクと同様のものを導入
      deadline: new Date("2023-10-19T23:59:59"),
      completed: false,
    },
  ];

  const handleSearch = () => {
    // 検索ボタンの処理
    const filteredTodos = sampleData.filter((todo) =>
      todo.content.toLowerCase().includes(searchText.toLowerCase())
    );
    setTodos(filteredTodos);
  };

  const handleTodoGETAll = () => {
    // 全件表示ボタンの処理
    setTodos(sampleData); // サンプルデータをセット
  };

  const handleSort = () => {
    // 検索ボタンの処理
    const sortedTodos = [...todos].sort((a, b) => {
      if (!a.deadline) return 1; // 期限がないタスクは最後に
      if (!b.deadline) return -1; // 期限がないタスクは最後に
      return a.deadline.getTime() - b.deadline.getTime();
    });
    setTodos(sortedTodos);
  };

  const handleShowCompleated = () => {
    // 完了状態のタスクだけを表示するハンドラ
    const completedTodos: Todo[] = todos.filter((todo) => todo.completed);
    setTodos(completedTodos);
    setShowCompleted(true);
  };

  const handleShowIncomplete = () => {
    // 未完了のタスクだけを表示するハンドラ
    const incompleteTodos: Todo[] = todos.filter((todo) => !todo.completed);
    setTodos(incompleteTodos);
    setShowCompleted(false);
  };
  
  const handleCreate = () => {
    // 作成ボタンの処理
    // ...
  };

  const handleDetail = () => {
    // 詳細ページに遷移
  };

  const handleComp = (index: number) => {
  // タスクの完了状態を切り替える関数
  const updatedTodos = [...todos];
  updatedTodos[index].completed = !updatedTodos[index].completed;
  setTodos(updatedTodos);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex justify-center">
        <div className="z-10 max-w-5xl w-full items-center font-mono text-sm lg:flex m-8">
          <h1 className="text-4xl">Todo一覧</h1>
        </div>
      </div>

      <div className="flex items-center">
          <input
            type="text"
            placeholder="Todo検索"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="p-2 mr-2"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-md mr-2">検索</button>
          <button onClick={handleTodoGETAll} className="bg-blue-500 text-white p-2 rounded-md mr-2">全件表示</button>
          <button onClick={handleSort} className="bg-blue-500 text-white p-2 rounded-md mr-2">期限/作成日</button>
          <button onClick={handleShowIncomplete}className="bg-blue-500 text-white p-2 rounded-md mr-2">未完了</button>
          <button onClick={handleCreate} className="bg-blue-500 text-white p-2 rounded-md mr-2">作成</button>
        </div>
      <div className="mt-4">
        <table className="border-collapse border" cellSpacing="0">
          <thead>
            <tr>
              <th className="p-2 border w-60">内容</th>
              <th className="p-2 border w-48">期限</th>
              <th className="p-2 border w-20">状況</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={index}>
                <td className="p-2 border ">{todo.content}</td>
                <td className="p-2 border">
                  {todo.deadline ? new Date(todo.deadline).toLocaleString() : 'なし'}
                </td>
                <td className="p-2 border text-center">{todo.completed ? '完了' : '未完了'}</td>
                <td className="p-2 border"><button onClick={handleDetail} className="bg-blue-500 text-white p-2 rounded-md mr-2">詳細</button> </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleComp(index)}
                    className={`bg-blue-500 text-white p-2 rounded-md mr-2 w-16 ${
                      todo.completed ? 'bg-red-500' : 'bg-green-600'
                    }`}
                  >
                    {todo.completed ? '未完了' : '完了'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Home;
