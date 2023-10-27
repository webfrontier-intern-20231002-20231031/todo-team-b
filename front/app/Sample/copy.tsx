"use client";
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';


//paginate設定

const itemsPerPage = 10; // 1ページあたりのアイテム数

const Home: React.FC = () => {
  const [data, setData] = useState([]); // データを格納するステート

  // ページング用のステート
  const [currentPage, setCurrentPage] = useState(0);

  // 現在のページのアイテムの範囲を計算
  const offset = currentPage * itemsPerPage;
  const currentPageData = data.slice(offset, offset + itemsPerPage);

  // ページが変更されたときのハンドラ
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  

  useEffect(() => {
    // APIからデータを取得してステートにセット
    fetch('https://jsonplaceholder.typicode.com/posts', {
    //fetch('http://127.0.0.1:8000/v1/todo', {
    cache: "no-store",
  })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // 空の依存配列で初回のみ実行

  return (
    <div>
      <ul>
        {currentPageData.map((item, index) => (
            <li key={item.id}>{item.title}</li>
            //<li key={item.id}>{item.content}</li>
        ))}
      </ul>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        pageCount={Math.ceil(data.length / itemsPerPage)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );
};

export default Home;