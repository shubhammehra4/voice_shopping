import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (_request, _reply) {
    const shops = await fastify.prisma.shop.findMany();

    return shops;
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, _reply) => {
    const shop = await fastify.prisma.shop.findFirst({
      where: { id: Number(request.params.id) },
      include: { products: true },
    });

    return shop;
  });
};

export default root;
