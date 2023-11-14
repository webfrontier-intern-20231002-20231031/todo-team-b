import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
interface Todo {
  id: number;
  content: string;
  deadline: Date | null;
  completed: boolean;
  updatedAt: Date;
  tags: Tags[];
}

interface Tags {
  id: number;
  name: string;
}

interface TodoUp {
  content: string;
  deadline: Date | null;
  tags: Tags[];
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tags, setTags] = useState<Tags[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(-1);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [content, setContent] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [sortOption, setSortOption] = useState("Update");

  const router = useRouter();

  const fetchTodoData = async () => {
    try {
      const response = await fetch('/api/TodoGETAll');
      if (response.status === 401) {
        router.push("../Login/");
        return
      }
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
    fetchTodoData();
  }, []);

  const fetchTagData  = async () => {
    try {
      const response = await fetch('/api/TagGETAll');
      if (response.status === 401) {
        router.push("../Login/");
        return
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const tagData: Tags[] = await response.json();
      setTags(tagData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchTagData();
  }, []);

  const controllerInputChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const controllerInputChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDate(e.target.value);
  }
  // const controllerInputChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTime(e.target.value);
  // }

  const isAllSelected = selectedTodoIds.length === todos.length;

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
      // setTodos(updatedTodos);

      for (const selectedId of idsToDelete) {
        const response = await fetch(`/api/TodoDELETE/${selectedId}`, {
          method: 'DELETE',
        });
        if (response.status === 401) {
          router.push("../Login/");
          return
        }
        if (response.ok) {
          console.log(`Successfully deleted Todo with ID ${selectedId}`);
        } else {
          console.error(`Failed to delete Todo with ID ${selectedId}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    setSelectedTodoIds([]);
    fetchTodoData();
  }

  const openDetailModal = (index: number) => {
    setSelectedTodoIndex(index);
    setIsDetailModalOpen(true);
    setSelectedTagIds(todos[index].tags.map((tag) => tag.id)); // 初期状態でTodoに紐づいているタグを選択
  }

  const closeDetailModal = () => {
    setSelectedTodoIndex(-1);
    setSelectedTagIds([]);
    setIsDetailModalOpen(false);
    setIsUpdated(false);
  }

  const updateSelectedTagIds = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  }

  const handleUpdateTodo = async () => {
    try {
      // 選択したTodoのID
      const selectedTodoId = todos[selectedTodoIndex].id;
  
      // PUTリクエストの送信先URL
      const url = `/api/TodoPUTDetail/${selectedTodoId}`;
  
      // PUTリクエストのボディ
      const requestBody: TodoUp = {
        content: content !== "" ? content : todos[selectedTodoIndex].content,
        deadline: date !== "" ? new Date(date) : todos[selectedTodoIndex].deadline,
        tags: tags.filter(tag => selectedTagIds.includes(tag.id))
      };
  
      // PUTリクエストの送信
      const response = await fetch(url,{
        cache: "no-store",
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        router.push("../Login/");
        return
      }
      if (response.ok) {
        console.log(`Successfully updated Todo with ID ${selectedTodoId}`);
      } else {
        console.error(`Failed to update Todo with ID ${selectedTodoId}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    setSelectedTagIds([]);
    setIsDetailModalOpen(false);
    setIsUpdated(false);
    location.reload()
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const sortFunction = (a: Todo, b: Todo) => {
    if (sortOption === "Update") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortOption === "Limit") {
      if (a.deadline === null && b.deadline === null) {
        return 0;
      }
      if (a.deadline === null) {
        return 1;
      }
      if (b.deadline === null) {
        return -1;
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return 0; // デフォルトはソートなし
  };
  
  const sortedTodos = [...todos].sort(sortFunction);

  const filteredTodos = sortedTodos.filter(todo => {
    const lowerCaseSearchText = searchText.toLowerCase();
    return (
      todo.content.toLowerCase().includes(lowerCaseSearchText) ||
      (todo.deadline && new Date(todo.deadline).toLocaleString().toLowerCase().includes(lowerCaseSearchText)) ||
      todo.tags.some(tag => tag.name.toLowerCase().includes(lowerCaseSearchText))
    );
  });
  
  return (
    <div className="overflow-x-auto z-0">
      <div className='flex py-2 justify-between'>
        <input 
          type="text" 
          placeholder="Search" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-full max-w-xs" />
        <select
          className="select select-ghost select-xm w-36 max-w-xs"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="Update">Created</option>
          <option value="Limit">Deadline</option>
        </select>
      </div>
      <table className="w-full table">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  id="checkAll"
                  type="checkbox"
                  className="checkbox"
                  checked={isAllSelected}
                  onChange={() => setSelectedTodoIds(isAllSelected ? [] : todos.map(todo => todo.id))}
                />
              </label>
            </th>
            <th className="p-6 w-96">Content</th>
            <th>
              {selectedTodoIds.length > 0 && (
              <label className='btn btn-ghost btn-xs text-red-500' onClick={handleDeleteSelected}>Delete</label>
            )}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map((todo, index) => (
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
                <div className="p-2 w-96 font-bold break-all">{todo.content}</div>
                <div className="px-2">
                  {todo.deadline ? new Date(todo.deadline).toLocaleString() : ''}
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
          // onClick={closeDetailModal}
        >
          <div className="modal-box w-11/12 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeDetailModal}
            >✕
            </button>
            <h3 className="py-2 font-bold text-2xl">Content</h3>
            <div className="modal-content">
              {isUpdated ? (
                <div>
                  <p>Todo</p>
                  <input
                    type="text"
                    placeholder={todos[selectedTodoIndex].content}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>
              ) : (
                <p className='px-2'>
                  {todos[selectedTodoIndex].content}
                </p>
              )}

              {isUpdated ? (
                <div>
                  <p>Deadline</p>
                  <input
                    type="text"
                    // @ts-ignore
                    placeholder={todos[selectedTodoIndex].deadline ? new Date(todos[selectedTodoIndex].deadline).toLocaleString() : '20XX-XX-XX XX:XX:XX'}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input input-bordered w-full "
                  />
                </div>
              ) : (
                <p className='px-2'>
                  {/* @ts-ignore */}
                  {todos[selectedTodoIndex].deadline ? new Date(todos[selectedTodoIndex].deadline).toLocaleString() : 'N/A'}
                </p>
              )}
              <br/>
              {isUpdated ? (
                tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`btn btn-ghost btn-xm ${
                      !todos[selectedTodoIndex].tags.some((t) => t.id === tag.id)
                        ? !selectedTagIds.includes(tag.id)
                          ? 'text-red-300'
                          : ''
                        : ''
                    }`}
                    onClick={() => updateSelectedTagIds(tag.id)}
                  >
                    {tag.name}
                  </span>
                ))
                
              ) : (
                todos[selectedTodoIndex].tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="btn btn-ghost btn-xs"
                  >
                    {tag.name}
                  </span>
                ))
              )}
            </div>
            <br/>
            <div className="text-center">
              <button 
                className={`btn ${isUpdated ? 'btn-success' : 'btn-primary'}`}
                onClick={isUpdated ? handleUpdateTodo : () => setIsUpdated(true)}
              >
                {isUpdated ? 'Updated' : 'Change'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default TodoList;