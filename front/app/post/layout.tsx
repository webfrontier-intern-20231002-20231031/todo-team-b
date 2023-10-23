export default function PostLayout({
    children,
  }: {
    children: React.ReactNode,
  }) {
    return (
      <div className="h-screen">{children}</div>
    );
  }