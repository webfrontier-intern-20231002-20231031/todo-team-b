import { NextApiRequest, NextApiResponse } from 'next';

const fetchData = async () => {
    try {
      const response = await axios.get<Todo[]>("http://127.0.0.1:8000/v1/todo");
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };