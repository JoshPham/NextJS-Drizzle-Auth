import { deleteSessionTokenCookie, getCurrentSession, invalidateSession } from "@/lib/session";

export async function GET() {
    const { session } = await getCurrentSession();
    if (!session) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/"
            }
        });
    }

    await invalidateSession(session.id);
    await deleteSessionTokenCookie();

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/"
        }
    });
}