type Tag = {
    id: string,
    name: string,
    email: string,
  };

export default async function GetTags() { 
    const response = await fetch('http://localhost:3000/todoGetById/api/getTags');
    if (!response.ok) throw new Error('Failed to fetch data');
    const tags: Tag[] = await response.json();
    return (
        <div>
            <h1 className="text-lg font-bold">タグ一覧</h1>
            <ul>
                {tags.map((tag) => (
                    <li key={tag.id}>{tag.name}</li>
                ))}
            </ul>
        </div>
        
    );
}