"use client";
import axios from "axios";
import React from "react";

// GETリクエスト
export const getJSON = async (): Promise<any> => {
  const url = "https://jsonplaceholder.typicode.com/todos/1"; // サンプルコード用、実際リクエストはしない
  const response = await axios.get(url);
  console.log(response.data);
};

// POSTリクエスト
export const postJSON = async (): Promise<any> => {
  const url = "https://jsonplaceholder.typicode.com/posts"; // サンプルコード用、実際リクエストはしない
  const data = {
    title: "foo",
    body: "bar",
    userId: 1,
  };
  const response = await axios.post(url, data);
  console.log(response.data);
};

const HomePage: React.FC = () => {
    React.useEffect(() => {
      getJSON();
      postJSON();
    }, []);
  
    return <div>Hello World</div>;
  };
  
export default HomePage;