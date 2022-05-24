import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (_request, _reply) {
    return { message: "Shopping Service is running" };
  });

  fastify.route({
    method: "GET",
    url: "/health",
    schema: {
      response: {
        200: {
          type: "object",
          properties: { state: { type: "string" } },
        },
      },
    },
    handler: async (_request, reply) => {
      return { state: "healthy" };
    },
  });
};

export default root;
