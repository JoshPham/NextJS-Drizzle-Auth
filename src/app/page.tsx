import { db } from "@/lib/db";
import { userTable } from "@/lib/schema/authSchema";
import { getCurrentSession } from "@/lib/session";
import Link from "next/link";

export default async function Home() {
  const users = await db
    .select()
    .from(userTable)
    .limit(10);
  
  const { user, session } = await getCurrentSession();

  return (
    <>
      {session && (
        <>
          <p>You are signed in as {user?.username}.</p>
          <a href="/logout">Sign out</a>
          <br />
        </>
      )}
      <Link href="/login">Login</Link>
      <h1>Users</h1>
      <table className="w-[50%]">
        <thead>
          <tr className="text-left">
            <th>Username</th>
            <th>Email</th>
            <th>Account Type</th>
            <th>Email Verified</th>
          </tr>
        </thead>
        <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.accountType}</td>
            <td>{user.emailVerified ? "Yes" : "No"}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
}
