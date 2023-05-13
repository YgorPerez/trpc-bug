import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getProjects: publicProcedure
    .input(z.object({ cursor: z.number() }))
    .output(
      z.object({
        data: z.array(z.object({ name: z.string(), id: z.number() })),
        nextCursor: z.number().optional(),
      })
    )
    .query(({ input }) => {
      const { cursor } = input;
      const pageSize = 5;

      const data = Array(pageSize)
        .fill(0)
        .map((_, i) => {
          return {
            name: `Project (${i + cursor}) (server time: ${Date.now()})`,
            id: i + cursor,
          };
        });

      const nextCursor =
        cursor < 10 ? Number(data?.[data?.length - 1]?.id) + 1 : undefined;
      return { data, nextCursor };
    }),
});
