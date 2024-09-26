import {Hono} from "hono";
import {db} from "@/db/db";
import {accounts} from "@/db/schema";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import {HTTPException} from "hono/http-exception";
import { eq } from "drizzle-orm";

const app = new Hono()
  .get("/",
    clerkMiddleware(),
    async (c) => {
    const auth = getAuth(c);

    if(!auth?.userId){
      return c.json({ error: "Unauthorized"}, 401);
    }

    const data = await db
        .select({
          id: accounts.id,
          name: accounts.name
        }).from(accounts)
        .where(eq(accounts.userId, auth.userId));
    console.log(data);
    return c.json({data: data});
  })

export default app;