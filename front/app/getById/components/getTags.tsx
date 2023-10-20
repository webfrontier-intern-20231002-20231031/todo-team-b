type User = {
    id: string,
    name: string,
    email: string,
  };

export default async function GetTags() { 
    const response = await fetch('http://localhost:3000/getById/api');
    if (!response.ok) throw new Error('Failed to fetch data');
    const users: User[] = await response.json();
    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}