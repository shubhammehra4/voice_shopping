import fp from "fastify-plugin";
import { Prisma, PrismaClient } from "@prisma/client";

interface PrismaPluginConfig {
  name: "fastify-prism";
  clientOptions: Prisma.PrismaClientOptions;
}

export default fp<PrismaPluginConfig>(async (fastify, opts) => {
  if (!fastify.prisma) {
    const prisma = new PrismaClient(opts.clientOptions);

    await prisma.$connect();

    fastify
      .decorate("prisma", prisma)
      .addHook("onClose", async (fastify, done) => {
        if (fastify.prisma === prisma) {
          await fastify.prisma.$disconnect();
          fastify.log.debug("Prisma pool disconnected");
        }
        done();
      });
  }
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const autoConfig: PrismaPluginConfig = {
  name: "fastify-prism",
  clientOptions:
    process.env.NODE_ENV === "development"
      ? { errorFormat: "pretty", log: ["query", "info", "warn", "error"] }
      : { errorFormat: "colorless", log: ["error"] },
};
