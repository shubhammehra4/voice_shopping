import { server } from "../utils/server";

export default function processPayment(orderId: number): Promise<boolean> {
  return server
    .post("/orders/payment", { orderId })
    .then((res) => res.status === 200);
}
