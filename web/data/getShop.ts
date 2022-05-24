import { server } from "../utils/server";
import type { Shop } from "./getShops";

export type Product = {
  id: number;
  shopId: number;
  name: string;
  price: number;
  imageUrl: string;
  status: "inStock" | "outOfStock";
};

export type ShopDetails = Shop & {
  products: Product[];
};

export default function getShop(shopId: number) {
  return server.get<ShopDetails>(`/shops/${shopId}`).then((res) => res.data);
}
