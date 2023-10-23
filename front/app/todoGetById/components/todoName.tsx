import React, { } from 'react';

// todoの名前をgetするためだけに型指定。適当に型指定している

type Todo = {
    id: string,
    content: string,
    complete: boolean,
    deadline: string,
    created_at: string,
    updated_at: string,
  };

export default async function TodoName() {
    const response = await fetch('http://localhost:3000/todoGetById/api/getTodo');
    if (!response.ok) throw new Error('Failed to fetch data');
    const todo: Todo[] = await response.json();
    return (
        <div className="px-4 py-5 sm:px-6 bg-indigo-600">
            {/* <h1 className="text-lg font-semibold text-white"> */}
                {todo.map((todo) => (<h1 key={todo.id}>{todo.content}
                </h1>))}
                {/* </h1> */}
            {/* <ul>
                {todo.map((todo) => (
                    <li key={todo.id}>{todo.content}</li>
                ))}
            </ul> */}
        </div>
    );
}