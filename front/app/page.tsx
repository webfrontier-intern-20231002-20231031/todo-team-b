'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

interface Todo {
  id: number;
  content: string;
  deadline: Date | null; // deadlineがnullの場合を考慮
  completed: boolean;
}

function Home() {
  const [searchText, setSearchText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/TodoGETAll');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Todo[] = await response.json();

      // 取得したデータをコンポーネントの状態にセット
      setTodos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // fetchDataをuseEffect内に移動して、コンポーネントがマウントされた時に実行
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filteredTodos = todos.filter((todo) =>
      todo.content.toLowerCase().includes(searchText.toLowerCase())
    );
    setTodos(filteredTodos);
  };

  const handleTodoGETAll = () => {
    // フィルター解除時に再度データを取得
    fetchData();
  };

  const handleSort = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.getTime() - b.deadline.getTime();
    });
    setTodos(sortedTodos);
  };

  const handleShowCompleted = () => {
    const completedTodos: Todo[] = todos.filter((todo) => todo.completed);
    setTodos(completedTodos);
    setShowCompleted(true);
  };

  const handleShowIncomplete = () => {
    const incompleteTodos: Todo[] = todos.filter((todo) => !todo.completed);
    setTodos(incompleteTodos);
    setShowCompleted(false);
  };

  const handleCreate = () => {
    router.push("/TodoPOST")
  };

  const handleDetail = (id: number) => {
    // 対応するTodoを検索
    const selectedTodo = todos.find((todo) => todo.id === id);

  };

  const handleComp = (id: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };
  
        fetch(`/api/TodoPUTCompleted`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTodo),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Server response:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
  
        return updatedTodo;
      }
      return todo;
    });
  
    fetchData();
  };
  
  const handleDelete = (id: number) => {
    const deletedTodo = todos.find((todo) => todo.id === id);

    if (deletedTodo) {
        console.log(deletedTodo.id);

        fetch(`/api/TodoDELETE`, {
            method: 'DELETE',
        });
    } else {
        console.log(`ID ${id}のTodoは見つかりませんでした。`);
    }

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
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-md mr-2">
          検索
        </button>
        <button onClick={handleTodoGETAll} className="bg-blue-500 text-white p-2 rounded-md mr-2">
          全件表示
        </button>
        <button onClick={handleSort} className="bg-blue-500 text-white p-2 rounded-md mr-2">
          期限/作成日
        </button>
        <button onClick={handleShowIncomplete} className="bg-blue-500 text-white p-2 rounded-md mr-2">
          未完了
        </button>
        <button onClick={handleCreate} className="bg-blue-500 text-white p-2 rounded-md mr-2">
          作成
        </button>
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
                <td className="p-2 border">
                  <button onClick={() => handleDetail(todo.id)} className="bg-blue-500 text-white p-2 rounded-md mr-2">
                    詳細
                  </button>{' '}
                </td>
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
                <td className="p-2 border">
                  <button onClick={() => handleDelete(todo.id)} className="bg-red-500 text-white p-2 rounded-md mr-2">
                    削除
                  </button>{' '}
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
