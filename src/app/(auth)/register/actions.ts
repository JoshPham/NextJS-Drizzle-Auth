"use server";

import { checkEmailAvailability } from "@/lib/email";
import { userSchema } from "@/lib/schema/authSchema";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/lib/session";
import { createUserWithCredentials } from "@/lib/user";

type CreateResponse = { error?: string } | Response;

export async function createUserAction(formData: FormData): Promise<CreateResponse> {
    const user = userSchema.safeParse(Object.fromEntries(formData));

    if (!user.success) {
        throw new Error("Invalid user data");
    }

    const emailAvailable = await checkEmailAvailability(user.data.email);
    if (!emailAvailable) {
        return { error: "Email is already in use" };
    }

    const newUser = await createUserWithCredentials(user.data.email, user.data.username, user.data.password);

    const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, newUser.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}