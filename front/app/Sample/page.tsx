"use client";
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

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
		// 作成ボタンの処理
		// ...
	};
	
	const handleDetail = (id: number) => {
	// 対応するTodoを検索
		const selectedTodo = todos.find((todo) => todo.id === id);
	
		if (selectedTodo) {
		  console.log('Selected Todo:', selectedTodo);
		} else {
		  console.log('Todo not found');
		}
	};
	
	const handleComp = (index: number) => {
		const updatedTodos = [...todos];
		updatedTodos[index].completed = !updatedTodos[index].completed;
		setTodos(updatedTodos);
	};

	//paginate設定
	// ページング用のステート
	const [currentPage, setCurrentPage] = useState(0);

	// 1ページあたりのアイテム数
	const itemsPerPage = 10; 

	// 現在のページのアイテムの範囲を計算
	const offset = currentPage * itemsPerPage;
	const currentPageData = todos.slice(offset, offset + itemsPerPage);

	// ページが変更されたときのハンドラ
	const handlePageClick = (selectedPage: { selected: number }) => {
		setCurrentPage(selectedPage.selected);
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
				<ReactPaginate
					previousLabel={'<'}
					nextLabel={'>'}
					pageCount={Math.ceil(todos.length / itemsPerPage)}
					pageRangeDisplayed={3}
					marginPagesDisplayed={1}
					onPageChange={handlePageClick}
					containerClassName="pagination"
					activeClassName="active"
				/>
			</div>
		</main>
	);
};

export default Home;