interface Tag {
    id: string;
    name: string;
    // todos: string, //使わず
  };

export async function TagGETALL() { 
    const response = await fetch('/api/TagGETAll/',{
        cache: "no-store",
    });
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