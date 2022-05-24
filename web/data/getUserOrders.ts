import { server } from "../utils/server";

type OrderPayment = {
  id: number;
  status: {
    completed: "completed";
    pending: "pending";
  };
};

export type Order = {
  id: number;
  shippingAddress: string;
  contactNumber: string;
  status: string;
  paymentId: number;
  createdAt: Date;
  updatedAt: Date;
} & OrderPayment;

export default function getUserOrders(contactNumber: string): Promise<Order[]> {
  return server
    .get<Order[]>(`/orders/${contactNumber}`)
    .then((res) => res.data);
}
