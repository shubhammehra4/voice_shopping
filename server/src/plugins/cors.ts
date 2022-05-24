import fp from "fastify-plugin";
import fastifyCors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify, opts) => {
  fastify.register(fastifyCors, opts);
});

export const autoConfig: FastifyCorsOptions = {
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
};
