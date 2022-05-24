import { PrismaClient } from "@prisma/client";

seedDB().then(() => {
  console.info("Seeding Complete");
});

async function seedDB() {
  const prisma = new PrismaClient();

  await createShops(prisma);

  await createProducts(prisma);
}

async function createProducts(prisma: PrismaClient) {
  await prisma.product.createMany({
    data: [
      {
        name: "Dairy Milk",
        price: 100,
        shopId: 1,
        status: "inStock",
        imageUrl:
          "https://www.bigbasket.com/media/uploads/p/xxl/281026_6-cadbury-dairy-milk-chocolate.jpg",
      },
      {
        name: "Silk",
        price: 1000,
        shopId: 1,
        status: "inStock",
        imageUrl:
          "https://www.bigbasket.com/media/uploads/p/xxl/1202130-3_3-cadbury-dairy-milk-silk-bubbly-valentine-chocolate-bar.jpg",
      },
      {
        name: "5 Star",
        price: 50,
        shopId: 1,
        status: "inStock",
        imageUrl:
          "https://www.bigbasket.com/media/uploads/p/l/100021022_10-cadbury-5-star-chocolate-bar.jpg",
      },
      {
        name: "Crispello",
        price: 200,
        shopId: 1,
        status: "inStock",
        imageUrl:
          "https://www.bigbasket.com/media/uploads/p/xxl/40137482-2_6-cadbury-dairy-milk-chocolate-bar-crispello.jpg",
      },
      {
        name: "Milky Bar",
        price: 70,
        shopId: 1,
        status: "inStock",
        imageUrl:
          "https://www.bigbasket.com/media/uploads/p/xxl/40090019_3-nestle-milkybar-bar.jpg",
      },

      {
        name: "Iphone 12",
        price: 20000,
        shopId: 2,
        status: "inStock",
        imageUrl:
          "https://m.media-amazon.com/images/I/61eDXs9QFNL._SL1500_.jpg",
      },
      {
        name: "Galaxy S22",
        price: 10000,
        shopId: 2,
        status: "inStock",
        imageUrl: "https://m.media-amazon.com/images/I/71PvHfU+pwL._SX679_.jpg",
      },
      {
        name: "OnePlus 12",
        price: 10000,
        shopId: 2,
        status: "inStock",
        imageUrl: "https://m.media-amazon.com/images/I/61mIUCd-37L._SX679_.jpg",
      },
      {
        name: "Galaxy Note 12",
        price: 30000,
        shopId: 2,
        status: "outOfStock",
        imageUrl:
          "https://m.media-amazon.com/images/I/71G1FCIP1EL._SL1500_.jpg",
      },

      {
        name: "Apples (pack of 6)",
        price: 300,
        shopId: 4,
        status: "inStock",
        imageUrl:
          "https://www.bigbasket.com/media/uploads/p/xxl/40033819-2_6-fresho-apple-shimla.jpg",
      },
      {
        name: "Mangos (pack of 8)",
        price: 500,
        shopId: 4,
        status: "inStock",
        imageUrl:
          "https://www.bigbasket.com/media/uploads/p/xxl/40194855_1-fresho-mango-alphonso.jpg",
      },
      {
        name: "Dozen Bananas",
        price: 200,
        shopId: 4,
        status: "inStock",
        imageUrl:
          "https://www.bigbasket.com/media/uploads/p/xxl/40064364-2_2-fresho-robusta-banana-premium.jpg",
      },
    ],
  });
}

async function createShops(prisma: PrismaClient) {
  await prisma.shop.createMany({
    data: [
      {
        name: "DMart",
        address: "Pune, Maharashtra",
        merchantName: "Radhakishan Damani",
        status: "open",
      },
      {
        name: "Best Price",
        address: "Mumbai, Maharashtra",
        merchantName: "Sameer Aggarwal",
        status: "open",
      },
      {
        name: "Metro",
        address: "Mumbai, Maharashtra",
        merchantName: "Arvind Mediratta",
        status: "close",
      },
      {
        name: "Reliance Marts",
        address: "Mumbai, Maharashtra",
        merchantName: "Ambani",
        status: "open",
      },
    ],
  });
}
