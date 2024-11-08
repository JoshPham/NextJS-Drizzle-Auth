import { userTable, User, UserInsert, accountTypeEnum } from "@/lib//schema/authSchema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { hashPassword } from "./password";

export async function getUserFromGitHubId(githubId: number): Promise<User | null> {
    const users =  await db
        .select()
        .from(userTable)
        .where(eq(userTable.githubId, githubId))
        .limit(1);
    
    return users.length > 0 ? users[0] : null;
}

export async function createUserWithGithub({
    githubId,
    email,
    username
} : {
    githubId: number,
    email: string,
    username: string
}): Promise<User> {
    const user = await db
        .insert(userTable)
        .values({
            accountType: 'github',
            githubId: githubId,
            email: email.toLowerCase(),
            username: username,
            emailVerified: 1
        })
        .returning();
    

    return user[0];
}


export async function createUserWithCredentials(email: string, username: string, password: string): Promise<User> {
	const passwordHash = await hashPassword(password);
	
    const user = await db
        .insert(userTable)
        .values({
            accountType: 'email',
            email: email.toLowerCase(),
            username: username,
            password: passwordHash,
            emailVerified: 0
        })
        .returning();

	return user[0];
}

export async function getUser({
    email,
    username
} : {
    email?: string,
    username?: string
}): Promise<User | null> {
    if (!email && !username) {
        return null;
    }

    if (email) {
        console.log("HIEDJIDJFI", email)
        const users = await db
            .select()
            .from(userTable)
            .where(eq(userTable.email, email.toLowerCase()))
            .limit(1);
        
        return users.length > 0 ? users[0] : null;
    }

    if (username) {
        const users = await db
            .select()
            .from(userTable)
            .where(eq(userTable.username, username as string))
            .limit(1);

        return users.length > 0 ? users[0] : null;
    }

    return null;
}