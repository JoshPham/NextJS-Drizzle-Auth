import { InferInsertModel, InferSelectModel, sql, SQL } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/mysql-core";
import { pgTable, serial, text, integer, timestamp, AnyPgColumn } from "drizzle-orm/pg-core";
import { z } from "zod";

export const accountTypeEnum = ["email", "google", "github"] as const;

export const userTable = pgTable(
	"users", 
	{
		id: serial("id").primaryKey(),
		accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
		githubId: integer("github_id"),
		email: text("email").notNull().unique(),
		username: text("name").notNull().unique(),
		password: text("password"),
		emailVerified: integer("email_verified").notNull().default(0),
	}, (table) => ({
		emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(lower(table.email)),
	})
);

export function lower(email: AnyPgColumn): SQL {
	return sql`lower(${email})`;
}

export const userSchema = z.object({
	username: z.string().min(3).max(32),
	email: z.string().email(),
	password: z.string().min(8)
});

export const userLoginSchema = z.object({
	username: z.string().min(3).max(32).optional(),
	email: z.string().email().optional(),
	password: z.string().min(8)
});


export const sessionTable = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export type User = InferSelectModel<typeof userTable>;
export type UserInsert = InferInsertModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
