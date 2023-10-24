import React, { useEffect, useState } from 'react';

interface Todo {
  id: number;
  content: string;
  deadline: Date | null; // 'null' を許容する型に変更
  completed: boolean;
}



const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    // サーバーからデータを取得する非同期関数をここに追加
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: Todo[] = await response.json();
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
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
  );
};

export default TodoList;
