import { FastifyPluginAsync } from "fastify";

type CreateOrder = {
  shippingAddress: string;
  contactNumber: string;
  items: {
    productId: number;
    quantity: number;
  }[];
};

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async (_request, _reply) => {
    const orders = await fastify.prisma.order.findMany();
    return orders;
  });

  fastify.post<{ Body: CreateOrder }>("/", async function (request, reply) {
    const { shippingAddress, contactNumber, items } = request.body;

    await fastify.prisma.order.create({
      data: {
        shippingAddress,
        contactNumber,
        status: "pending",
        orderItems: {
          createMany: {
            data: items.map(({ productId, quantity }) => ({
              productId: Number(productId),
              quantity: Number(quantity),
            })),
          },
        },
        payment: { create: { status: "pending" } },
      },
    });

    return reply.code(201).send({ message: "created" });
  });

  fastify.get<{ Params: { contactNumber: string } }>(
    "/:contactNumber",
    async (request, reply) => {
      const orders = await fastify.prisma.order.findMany({
        where: { contactNumber: request.params.contactNumber },
        include: {
          payment: {
            select: { id: true, status: true },
          },
        },
      });

      return orders;
    }
  );

  fastify.post<{ Body: { orderId: string } }>(
    "/payment",
    async (request, _reply) => {
      await fastify.prisma.order.update({
        where: { id: Number(request.body.orderId) },
        data: {
          status: "completed",
          payment: { update: { status: "completed" } },
        },
      });

      return { message: "done" };
    }
  );
};

export default root;
