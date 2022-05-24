import { server } from "../utils/server";

export type CreateOrder = {
  shippingAddress: string;
  contactNumber: string;
  items: {
    productId: number;
    quantity: number;
  }[];
};

export default function createOrder(input: CreateOrder): Promise<boolean> {
  return server.post("/orders", input).then((res) => res.status === 201);
}
