import fp from "fastify-plugin";
import fastifySwagger, { SwaggerOptions } from "@fastify/swagger";

export default fp<SwaggerOptions>(async (fastify, opts) => {
  fastify.register(fastifySwagger, opts);
});

export const autoConfig: SwaggerOptions = {
  routePrefix: "/swagger",
  swagger: {
    info: {
      title: "Shopping App",
      description: "Backend service for Shopping App",
      version: "1.0.0",
    },
    host: "localhost",
    schemes: ["http"],
  },
  uiConfig: { deepLinking: false },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: process.env.NODE_ENV === "development",
};
