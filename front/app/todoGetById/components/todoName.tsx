import React, { } from 'react';

type Todo = {
    id: string,
    content: string,
    complete: boolean,
    deadline: string,
    createdAt: string,
    updatedAt: string,
  };

export default function TodoName() {
    // const response = await fetch('http://localhost:3000/todoGetById/api/getTags');
    // if (!response.ok) throw new Error('Failed to fetch data');
    // const todo: Todo[] = await response.json();
    return (
        <div className="px-4 py-5 sm:px-6 bg-indigo-600">
            <h1 className="text-lg font-semibold text-white">todo</h1>
        </div>
    );
}