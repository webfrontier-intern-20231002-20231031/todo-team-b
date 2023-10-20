type User = {
    id: string,
    name: string,
    email: string,
  };

export default async function GetTags() { 
    const response = await fetch('http://localhost:3000/getById/testApi');
    if (!response.ok) throw new Error('Failed to fetch data');
    const users: User[] = await response.json();
    return (
        <div>
            <h1 className="text-lg font-bold">タグ一覧</h1>
            <ul>
            {users.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
            </ul>
        </div>
        
    );
}