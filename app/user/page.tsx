import { cacheLife } from "next/cache";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function UserPage() {
  "use cache";
  cacheLife("seconds");

  const data = await fetch(
    "https://690da16aa6d92d83e8525a6e.mockapi.io/api/v1/user"
  );
  const users = (await data.json()) as any[];

  return (
    <div className="max-w-7xl h-full mx-auto px-4">
      {users.map((user: { id: number; name: string; bio: string }) => (
        <div
          key={user.id}
          className="mt-4 text-lg font-semibold text-blue-600 hover:text-blue-800 
          cursor-pointer transition-colors hover:bg-blue-100 p-2 rounded border border-blue-200"
        >
          <h1 className="text-lg font-semibold">{user.name}</h1>
          <p className="text-sm text-gray-600">{user.bio}</p>
        </div>
      ))}
    </div>
  );
}
