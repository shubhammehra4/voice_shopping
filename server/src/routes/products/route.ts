import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Params: { shopId: string } }>(
    "/:shopId",
    async function (request, _reply) {
      const products = await fastify.prisma.product.findMany({
        where: {
          shopId: Number(request.params.shopId),
        },
      });

      return products;
    }
  );
};

export default root;
