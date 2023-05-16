import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { env } from "~/env.mjs";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import transformer from "../../utils/transformer";

export const config = {
  runtime: "edge",
};

// export API handler
async function nextApiHandler(req: NextRequest) {
  return fetchRequestHandler({
    router: appRouter,
    createContext: () => {},
    req,
    endpoint: "/api/trpc",
    onError: ({ path, error }) => {
      env.NODE_ENV === "development"
        ? console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${
              error.message
            }, cause: ${(error.cause as unknown as string) ?? "<no-path>"}`
          )
        : null;
    },
  });
}

function handler(req: AxiomRequest, res: NextResponse, event: NextFetchEvent) {
  const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  const MAX_CACHE_TIME = ONE_DAY_IN_SECONDS * 31;
  res?.headers?.set(
    "cache-control",
    `s-maxage=${MAX_CACHE_TIME}, stale-whi, le-revalidate=${MAX_CACHE_TIME}`
  );
  return nextApiHandler(req, res, event);
}

export default handler;
