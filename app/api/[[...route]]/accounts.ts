import {Hono} from "hono";
import {db} from "@/db/db";
import {accounts, insertAccountSchema} from "@/db/schema";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import {and, eq, inArray} from "drizzle-orm";
import {zValidator} from "@hono/zod-validator";
import {createId} from "@paralleldrive/cuid2";
import {z} from "zod";

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
    return c.json({data: data}, 200);
  })
  .get("/:id",
       clerkMiddleware(),
       zValidator("param", z.object({
        id: z.string().optional(),
       })),
        async (c) => {
          const auth = getAuth(c);
          const { id } = c.req.valid("param");

          if(!auth?.userId){
            return c.json({ error: "Unauthorized"}, 401);
          }

          if(!id){
            return c.json({ error: "Bad Request"}, 400);
          }

          const [data] = await db.select({
            id: accounts.id,
            name: accounts.name
          }).from(accounts)
          .where(and(
            eq(accounts.id, id),
            eq(accounts.userId, auth.userId)
          ));

          if(!data) {
            return c.json({ error: "Not Found"}, 404);
          }

          return c.json({data}, 200);
        })
  .post("/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true,})),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if(!auth?.userId){
        return c.json({ error: "Unauthorized"}, 401);
      }

      const [data] = await db.insert(accounts).values({
        id: createId(),
        userId: auth.userId,
        ...values
      }).returning();

      return c.json(data, 200);
    })
  .post("/delete",
      clerkMiddleware(),
      zValidator("json", z.object({
        ids: z.array(z.string()),
      })),
      async (c) => {
        const auth = getAuth(c);
        const values = c.req.valid("json");

        if(!auth?.userId){
          return c.json({
            error: "Unauthorized"
          }, 401);
        }

        const data = await db.delete(accounts)
          .where(and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )).returning({
            id: accounts.id,
          })

        return c.json(data);
      }
    )
  .patch("/:id", 
    clerkMiddleware(),
    zValidator("param", z.object({
      id: z.string().optional()
    })),
    zValidator("json", insertAccountSchema.pick({ name: true})),    
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const value = c.req.valid("json");

      if(!auth?.userId){
        return c.json({error: "Unauthorized"}, 401);
      }

      if(!id){
        return c.json({error: "Missing Id"}, 400);
      }

      const [data] = await db.update(accounts)
                    .set(value)
                    .where(and(
                      eq(accounts.id, id),
                      eq(accounts.userId, auth.userId)
                    )).returning();
      if(!data){
        return c.json({error: "Not Found"}, 404);
      }

      return c.json({data}, 200);
    }
  )
  .delete("/:id", 
    clerkMiddleware(),
    zValidator("param", z.object({
      id: z.string().optional()
    })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if(!auth?.userId){
        return c.json({error: "Unauthorized"}, 401);
      }

      if(!id){
        return c.json({error: "Missing Id"}, 400);
      }

      const [data] = await db.delete(accounts)
                    .where(and(
                      eq(accounts.id, id),
                      eq(accounts.userId, auth.userId)
                    )).returning({
                      id : accounts.id,
                    });
      if(!data){
        return c.json({error: "Not Found"}, 404);
      }

      return c.json({data}, 200);
    }
  );

export default app;