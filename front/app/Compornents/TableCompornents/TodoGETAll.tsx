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
  const [selectAll, setSelectAll] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(-1);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]); // 選択されたTodoアイテムのIDを格納

  const fetchData = async () => {
    try {
      const response = await fetch('/api/TodoGETAll');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSelectAll = () => {
    const updatedSelectAll = !selectAll;
    setSelectAll(updatedSelectAll);
    const updatedSelectedTodoIds = updatedSelectAll ? todos.map((todo) => todo.id) : [];
    setSelectedTodoIds(updatedSelectedTodoIds);
  }
  

  const toggleTodoSelect = (id: number) => {
    if (selectedTodoIds.includes(id)) {
      setSelectedTodoIds(selectedTodoIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedTodoIds([...selectedTodoIds, id]);
    }
    const allSelected = todos.every((todo) => selectedTodoIds.includes(todo.id));
    setSelectAll(allSelected);
  }

  const handleDeleteSelected = async () => {
    try {
      let idsToDelete = selectedTodoIds;
  
      const updatedTodos = todos.filter((todo) => !idsToDelete.includes(todo.id));
      setTodos(updatedTodos);

      for (const selectedId of idsToDelete) {
        const response = await fetch(`/api/TodoDELETE/${selectedId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log(`Successfully deleted Todo with ID ${selectedId}`);
        } else {
          console.error(`Failed to delete Todo with ID ${selectedId}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    // 選択状態をクリア
    setSelectedTodoIds([]);
  }

  const openDetailModal = (index: number) => {
    setSelectedTodoIndex(index);
    setIsDetailModalOpen(true);
  }

  const closeDetailModal = () => {
    setSelectedTodoIndex(-1);
    setIsDetailModalOpen(false);
  }

  return (
    <div className="overflow-x-auto z-0">
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  id="checkAll"
                  type="checkbox"
                  className="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </label>
            </th>
            <th className="p-6">Content</th>
            <th>
              {selectedTodoIds.length > 0 && (
              <label className='btn btn-ghost btn-xs text-red-500' onClick={handleDeleteSelected}>Delete</label>
            )}
            </th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={index}>
              <td>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedTodoIds.includes(todo.id)}
                    onChange={() => toggleTodoSelect(todo.id)}
                  />
                </label>
              </td>
              <td>
                <div className="p-2 font-bold">{todo.content}</div>
                <div className="px-2">
                  {todo.deadline ? new Date(todo.deadline).toLocaleString() : 'N/A'}
                </div>
                <div className="px-2">
                  <div className="text-sm opacity-50">
                    {todo.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="btn btn-ghost btn-xs">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </td>
              <td>
                <button className="btn btn-ghost btn-xs" onClick={() => openDetailModal(index)}>details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDetailModalOpen && selectedTodoIndex !== -1 && (
        <dialog
          id="my_modal"
          className="modal"
          open={isDetailModalOpen}
          onClick={closeDetailModal}
        >
          <div className="modal-box w-11/12 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg">Content</h3>
            <p className="py-4">
              {todos[selectedTodoIndex].content}
              <br />
              {/* @ts-ignore */}
              {todos[selectedTodoIndex].deadline ? new Date(todos[selectedTodoIndex].deadline).toLocaleString() : 'N/A'}
              <br />
              {todos[selectedTodoIndex].tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`btn btn-ghost btn-xs ${todos[selectedTodoIndex].tags.some((t) => t.id === tag.id) ? '' : 'text-opacity-50'}`}
                >
                  {tag.name}
                </span>
              ))}
            </p>
          </div>
        </dialog>
      )}
      
    </div>
  );
}

export default TodoList;
