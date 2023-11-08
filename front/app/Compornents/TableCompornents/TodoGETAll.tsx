import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  content: string;
  deadline: Date | null;
  completed: boolean;
  tags: Tags[];
}

interface Tags {
    id: number;
    name: string;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

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

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Content</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={index}>
              <td>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </td>
                <td>
                  <div className="flex items-center">
                    <td className="p-2 font-bold">{todo.content}</td>
                  </div>
                    <td className="p-2">
                        <div>{todo.deadline ? new Date(todo.deadline).toLocaleString() : 'N/A'}</div>
                        <div className="text-sm opacity-50">
                          {todo.tags.map((tag, tagIndex) => (
                            <label key={tagIndex} className="btn btn-ghost btn-xs">
                              {tag.name}
                            </label>
                          ))}
                        </div>
                    </td>
                </td>
              <th>
                <button className="btn btn-ghost btn-xs">details</button>
              </th>
            </tr>
          ))}
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>content</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default TodoList;
