'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

interface TodoPOST {
  content: string;
  deadline: Date | null;
  tags: Tags[] | null
}

// interface tagUp {
//   tags: Tags[]
// }

interface Tags {
  id: number;
  name: string;
}



export default function Header() {
  const [content, setContent] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [tags, setTags] = useState<Tags[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>("");

  const router = useRouter();

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
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  
  const openTagModal = () => {
    setIsTagModalOpen(true);
  };

  const closeTagModal = () => {
    setIsTagModalOpen(false);
  };

  const updateSelectedTagIds = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  }

  const tagsContent = tags.map((tag, tagIndex) => (
    <span
      key={tagIndex}
      className={`btn btn-ghost btn-xm ${
        selectedTagIds.includes(tag.id) ? 'text-red-500' : ''
      }`}
      onClick={() => updateSelectedTagIds(tag.id)}
    >
      {tag.name}
    </span>
  ));

  const handleCreateTodo = async (): Promise<void> => {
  const requestBody: TodoPOST = {
    content: content,
    deadline: date !== "" ? new Date(date) : null,
    tags: tags.filter(tag => selectedTagIds.includes(tag.id)),
  };

  try {
    // まずTodoをPOST
    const res = await fetch('/api/TodoPOST', {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    if (res.status === 401) {
      router.push("../Login/");
      return
    }else if (res.ok) {
      // Todoが正常に作成された場合
      // const createdTodo = await res.json(); // 新しく作成されたTodoの情報を取得

      // const tagAdd: tagUp = {
      //   tags: tags.filter(tag => selectedTagIds.includes(tag.id)),
      // };

      // // Todoが作成された後にTagをPUT
      // const tagRes = await fetch(`/api/TodoPUTTag/${createdTodo.id}`, {
      //   cache: "no-store",
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(tagAdd),
      // });

      // if (tagRes.ok) {
      await alert('Todo created successfully!');
      await location.reload();
    } else {
      await alert('Failed to create Todo.');
    }

    closeModal();
  } catch (err) {
    alert(err);
  }
};

const handleDELETETags = async (): Promise<void> => {
  try {
    for (const selectedId of selectedTagIds) {
      const tagToDelete = tags.find((tag) => tag.id === selectedId);

      if (tagToDelete) {
        // タグが見つかった場合、APIを呼び出してタグを削除
        const res = await fetch(`/api/TagDELETE/${selectedId}`, {
          method: 'DELETE',
        });

        if (res.status === 401) {
          router.push("../Login/");
          return
        }
        if (res.ok) {
          
        } else {
          // タグの削除が失敗した場合
          alert(`Failed to delete tag "${tagToDelete.name}".`);
        }
      } else {
        // タグが見つからなかった場合
        alert(`Tag with ID ${selectedId} not found.`);
      }
    }
    setSelectedTagIds([]);
    fetchTagData();
    
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleCreateTag = async (): Promise<void> => {
  try {
    // 入力されたタグ名が空でないことを確認
    if (newTagName.trim() === "") {
      alert('Tag name cannot be empty.');
      return;
    }

    const res = await fetch('/api/TagPOST', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newTagName }),
    });

    if (res.status === 401) {
      router.push("../Login/");
      return
    }
    if (res.ok) {
      fetchTagData();
      setNewTagName("");
    } else {
      alert(`Failed to create tag "${newTagName}".`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};



  return (
    <div className="sticky top-0 w-full z-10">
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="navbar bg-neutral text-neutral-content">
            <div className="navbar-start">
              <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </label>
            </div>
            <div className="navbar-center">
              <a href="./" className="btn btn-ghost normal-case text-xl">TodoList</a>
            </div>
            <div className="navbar-end">
              {/* logoutボタン */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu p-4 w-40 min-h-full bg-base-200 text-base-content">
            <li><label className='btn btn-ghost' onClick={openModal}>TodoPOST</label></li>
            <li><label className='btn btn-ghost' onClick={openTagModal}>Tags</label></li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog
        id="my_modal"
        className="modal"
        open={isModalOpen}
      >
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >✕
            </button>
            <h3 className="py-2 font-bold text-2xl">Create Todo</h3>
            <div className="modal-content">
              <div>
                <p>Todo</p>
                <input
                  type="text"
                  placeholder="ex) 散歩する"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div>
                <p>Deadline (20XX-X-X XX:XX:XX)</p>
                <input
                  type="text"
                  placeholder="ex) 2000-10-1 00:00:00"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              {/* {tagsContent} */}
              <br />
            </div>
            <div className="text-center">
              <button
                className="btn btn-primary"
                onClick={handleCreateTodo}
              >
                Create Todo
              </button>
            </div>
          </div>
        </dialog>
      )}
        {/* New Tag Modal */}
      {isTagModalOpen && (
        <dialog
          id="tag_modal"
          className="modal"
          open={isTagModalOpen}
        >
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeTagModal}
            >✕
            </button>
            <h3 className="py-2 font-bold text-2xl">Tag List</h3>
            <div className="modal-content">
              <div className='border border-neutral-500 border-2 rounded-lg '>
                {tagsContent}
              </div>
              <div>
                <br/>
                <input
                  type="text"
                  placeholder="Tag Name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="input input-bordered input-primary w-full max-w-xm"
                />
              </div>
              <div className="py-2 text-center">
              <button
                className="btn btn-primary text-white"
                onClick={handleCreateTag}
              >
                Add
              </button>
              <button
                className="btn bg-red-500 text-white"
                onClick={handleDELETETags}
              >
                Delete
              </button>
              </div>
            </div>
          </div>
        </dialog>
      )}

    </div>
  );
};
