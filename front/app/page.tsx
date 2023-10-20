export default function Home() {


  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl">Todo一覧</h1>
        <div className="flex items-center">
          <input type="text" placeholder="Todo検索" className="p-2 mr-2" />
          <button className="bg-blue-500 text-white p-2 rounded-md mr-2">全件表示</button>
          <button className="bg-green-500 text-white p-2 rounded-md mr-2">期限/作成日</button>
          <button className="bg-red-500 text-white p-2 rounded-md mr-2">完了/未完了</button>
          <button className="bg-yellow-500 text-white p-2 rounded-md">作成</button>
        </div>
      </div>
    </main>
  );
}
