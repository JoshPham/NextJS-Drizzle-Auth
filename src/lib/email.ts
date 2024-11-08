import { eq } from "drizzle-orm";
import { db } from "./db";
import { userTable } from "./schema/authSchema";

export function verifyEmailInput(email: string): boolean {
	return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
	const result = await db.select().from(userTable).where(eq(userTable.email, email));
    return result.length === 0;
}