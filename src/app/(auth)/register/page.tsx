import { getCurrentSession } from "@/lib/session";
import { createUserAction } from "./actions";

export default async function Page() {
	const { user, session } = await getCurrentSession();
	
	if (session) {
		return (
			<>
				<h1>Already signed in</h1>
				<p>You are already signed in as {user?.username}.</p>
				<a href="/logout">Sign out</a>
			</>
		);
	}


	return (
		<div className="flex flex-col gap-2">
			<h1>Sign in</h1>
			<form action={(
				async (formData) => {
					"use server";
					const res = await createUserAction(formData);
					if ("error" in res && res.error) {
						console.log(res.error);
					}
				})}>
				<label className="flex gap">Username</label>
				<input type="text" name="username" className="text-black" required />
				<br />
				<label className="flex gap">Email</label>
				<input type="email" name="email" className="text-black" required />
				<br />
				<label className="flex gap">Password</label>
				<input type="password" name="password" className="text-black" required />
				<br />
				<button type="submit">Sign up</button>
			</form>

			or
			<a href="/login/github">Sign up with GitHub</a>
		</div>
	);
}
