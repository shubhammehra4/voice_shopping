import { server } from "../utils/server";

export type Shop = {
  id: number;
  name: string;
  merchantName: string;
  address: string;
  status: "open" | "close";
};

export default function getShops(): Promise<Shop[]> {
  return server.get<Shop[]>("/shops").then((res) => res.data);
}
