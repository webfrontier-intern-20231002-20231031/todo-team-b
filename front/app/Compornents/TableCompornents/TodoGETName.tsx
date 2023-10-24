import React, { } from 'react';

/* 仮データ型　contentのみ使用 */
// type Todo = {
//     id: string,
//     content: string,
//     complete: boolean,
//     deadline: string,
//     createdAt: string,
//     updatedAt: string,
// };

export default /* async */ function TodoName() {
    // api処理に関する処理は削除
    // const response = await fetch('http://localhost:3000/todoGetById/api/getTags');
    // if (!response.ok) throw new Error('Failed to fetch data');
    // const todos: Todo[] = await response.json();
    return (
        <div className="px-4 py-5 sm:px-6 bg-indigo-600">
            <h1 className="text-lg font-semibold text-white">idに依存したcontent</h1>
        </div>
    );
}