'use client'
import React from 'react';
import Header from './Compornents/Header';
import TodoList from './Compornents/TableCompornents//TodoGETAll';

function Home() {


  // const handleSearch = () => {
  //   const filteredTodos = todos.filter((todo) =>
  //     todo.content.toLowerCase().includes(searchText.toLowerCase())
  //   );
  //   setTodos(filteredTodos);
  // };
  

//   const handleTodoGETAll = () => {
//     fetchData();
//   };

//   // ソート機能の修正
//   const handleSort = () => {
//     const sortedTodos = [...todos].sort((a, b) => {
//         if (a.deadline === null && b.deadline === null) {
//             return 0;
//         } else if (a.deadline === null) {
//             return 1;
//         } else if (b.deadline === null) {
//             return -1;
//         } else {
//             const dateA = new Date(a.deadline);
//             const dateB = new Date(b.deadline);
//             return dateA.getTime() - dateB.getTime();
//         }
//     });
//     setTodos(sortedTodos);
// };




//   const handleShowCompleted = () => {
//     const completedTodos: Todo[] = todos.filter((todo) => todo.completed);
//     setTodos(completedTodos);
//     setShowCompleted(true);
//   };

//   const handleShowIncomplete = () => {
//     const incompleteTodos: Todo[] = todos.filter((todo) => !todo.completed);
//     setTodos(incompleteTodos);
//     setShowCompleted(false);
//   };

//   const handleCreate = () => {
//     router.push("/TodoPOST")
//   };

//   const handleDetail = (id: number) => {
//     // 対応するTodoを検索
//     const selectedTodo = todos.find((todo) => todo.id === id);
//     if (selectedTodo != null){
//       router.push(`/TodoGETById/${selectedTodo.id}`)
//     }
//   };

//   const handleComp = (id: number) => {
//     const updatedTodos = todos.map((todo) => {
//       if (todo.id === id) {
//         const updatedTodo = {
//           completed: !todo.completed,
//         };
//         console.log(updatedTodo);

//         fetch(`/api/TodoPUTCompleted/${id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(updatedTodo),
//           })
//         }
//       }
//     )
//     location.reload();
//   }
  
//   const handleDelete = (id: number) => {
//     const deletedTodo = todos.find((todo) => todo.id === id);

//     if (deletedTodo) {
//         console.log(deletedTodo.id);

//         // fetch(`/api/TodoDELETE/${deletedTodo.id}`, {
//         //     method: 'DELETE',
//         // });
//         fetch(`/api/TodoDELETE/${deletedTodo.id}`, {
//           method: 'DELETE',
//       });
//     } else {
//         console.log(`ID ${id}のTodoは見つかりませんでした。`);
//     }

//   };

  return (

    <main className="flex min-h-screen flex-col items-center">
        <Header/>
        <TodoList/>

      {/* <div className="flex items-center my-4">
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
        <button className="bg-blue-500 text-white p-2 rounded-md mr-2"><a href="./Tags">タグ一覧</a></button>
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
            {currentPageData.map((todo, index) => (
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
                    onClick={() => handleComp(todo.id)}
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
        <ReactPaginate
					previousLabel={'<'}
					nextLabel={'>'}
					pageCount={Math.ceil(todos.length / itemsPerPage)}
					pageRangeDisplayed={3}
					marginPagesDisplayed={1}
					onPageChange={handlePageClick}
					containerClassName="pagination flex justify-center "
          pageClassName="pageClass m-5"
          previousClassName="pageClass m-5"
          nextClassName='pageClass m-5'
					activeClassName="active"
				/>
      </div> */}
    </main>
  );
}

export default Home;
