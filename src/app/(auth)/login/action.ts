"use server";

import { checkEmailAvailability, verifyEmailInput } from "@/lib/email";
import { comparePassword, verifyPasswordHash } from "@/lib/password";
import { userLoginSchema } from "@/lib/schema/authSchema";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/lib/session";
import { createUserWithCredentials, getUser } from "@/lib/user";

type CreateResponse = { error?: string } | Response;


export async function loginUserAction(formData: FormData): Promise<CreateResponse> {
    const form = Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [key, value as string])
    );

    let userInput = {
        password: form.password,
    } as {
        username?: string;
        email?: string;
        password: string;
    };


    let userEmail = false;

    if (verifyEmailInput(form.login)) {
        userEmail = true;
    }

    const user = userLoginSchema.safeParse(userInput);

    if (!user.success) {
        return { error: "Invalid input" };
    }   

    const userRes = await getUser(userEmail ? { email: form.login } : { username: form.login });

    if (!userRes) {
        return { error: "Invalid credentials" };
    }
    if (userRes.accountType !== "email") {
        return { error: "Wrong account type" };
    }
    if (!userRes.password) {
        return { error: "No Password" };
    }
    const isValid = await verifyPasswordHash(userRes.password, form.password); // hash first, then plain text password
    if (!isValid) {
        return { error: "Invalid password" };
    }

    const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, userRes.id);
	await setSessionTokenCookie(sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}