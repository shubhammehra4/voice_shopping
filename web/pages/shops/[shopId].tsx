import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsShop } from "react-icons/bs";
import { useQuery } from "react-query";
import SpeechRecognition, {
  SpeechRecognitionOptions,
  useSpeechRecognition,
} from "react-speech-recognition";
import Checkout from "../../components/Checkout";
import ProductCard from "../../components/ProductCard";
import { useCheckoutContext } from "../../context/checkout";
import getShop from "../../data/getShop";
import speakText from "../../utils/speak";

export type Cart = Record<number, number | undefined>;

const ShopPage: NextPage = () => {
  const router = useRouter();
  const { shopId } = router.query as { shopId: string };
  const { data: shop, isLoading } = useQuery(
    ["products", shopId],
    () => getShop(Number(shopId)),
    { enabled: typeof shopId !== "undefined" }
  );

  const [cart, setCart] = useState<Cart>({});
  const { setCart: setGlobalCart } = useCheckoutContext();

  const removeProduct = (id: number) =>
    setCart((cart) => {
      const updatedCart = { ...cart };
      delete updatedCart[id];
      return updatedCart;
    });

  const upsertProduct = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(id);
    } else {
      setCart((cart) => ({ ...cart, [id]: quantity }));
    }
  };

  const checkout = () => {
    setGlobalCart(cart);
    router.push(`/checkout/${shopId}`);
  };

  /**
   * Speech
   */
  const { stopListening, startListening } = SpeechRecognition;
  const commands: SpeechRecognitionOptions["commands"] = [
    {
      command: "list products",
      callback: () => {
        console.log("here");
        speakText(
          `Products present in ${shop?.name}, are; ${shop?.products
            .filter((p) => p.status === "inStock")
            .reduce<string>((acc, p) => acc + `, ${p.name}`, "")}`,
          {
            rate: 0.95,
            onStart: stopListening,
            onEnd: () => startListening({ continuous: true }),
          }
        );
      },
    },
    {
      command: "add * (to cart)",
      callback: (productName: string) => {
        const product = shop?.products.find(
          (p) => p.name.toLowerCase() === productName.toLowerCase()
        );

        if (product === undefined) {
          speakText("Product not found please try again", {
            onStart: stopListening,
            onEnd: () => startListening({ continuous: true }),
          });
          return;
        }

        upsertProduct(product.id, 1);
      },
    },
    {
      command: "remove * (from cart)",
      callback: (productName: string) => {
        const product = shop?.products.find(
          (p) => p.name.toLowerCase() === productName.toLowerCase()
        );

        if (product === undefined) {
          speakText("Product not found please try again", {
            onStart: stopListening,
            onEnd: () => startListening({ continuous: true }),
          });
          return;
        }

        removeProduct(product.id);
      },
    },
    {
      command: "checkout",
      callback: () => {
        const isEmpty = Object.entries(cart).length === 0;
        if (isEmpty) {
          speakText("The cart is empty please add a product before checkout", {
            onStart: stopListening,
            onEnd: () => startListening({ continuous: true }),
          });
          return;
        }

        speakText("Processing Checkout", {
          onStart: stopListening,
          onEnd: () => checkout(),
        });
      },
    },
    {
      command: "(go) back",
      callback: () => {
        router.push("/");
      },
    },
  ];

  const { listening } = useSpeechRecognition({
    commands,
    clearTranscriptOnListen: true,
  });

  const isFirstFullRender = useRef(true);
  useEffect(() => {
    if (typeof shop !== "undefined" && isFirstFullRender) {
      isFirstFullRender.current = false;

      speakText(
        `Welcome to ${shop.name}. To list products say, "list products". To add or remove a product from cart say, "add or remove with productName. To checkout say, "checkout". To go back say, "go back"`,
        { onEnd: () => startListening({ continuous: true }) }
      );
    }
  }, [startListening, shop]);

  // -------------------------------------------------------

  if (isLoading || typeof shop === "undefined") return <LoaderSpinner />;

  const cartCost = Object.entries(cart).reduce<number>(
    (acc, [id, quantity]) =>
      acc +
      (shop.products.find((p) => p.id === Number(id))?.price ?? 0) *
        (quantity ?? 0),
    0
  );

  return (
    <div style={{ position: "relative" }}>
      <Head>
        <title>{shop.name}</title>
        <meta name="description" content="One stop for all shopping needs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex
          p="10"
          bgColor="gray.100"
          alignItems="center"
          justifyContent="space-between"
          boxShadow="2xl"
        >
          <Box>
            <HStack spacing="2" justifyContent="end">
              <Icon as={BsShop} boxSize="5" />
              <Heading fontSize="2xl" my="0">
                {shop.name}
              </Heading>
            </HStack>
          </Box>
          <Box fontSize="xs">
            <Text>{shop.merchantName}</Text>
            <Text>{shop.address}</Text>
          </Box>
        </Flex>

        {Object.keys(cart).length !== 0 && (
          <Checkout
            cost={cartCost}
            itemCount={Object.keys(cart).length}
            checkout={checkout}
          />
        )}

        <Box mt="10" maxW="600px" mx="auto" px="5">
          <Heading fontSize="xl" my="5">
            Products
          </Heading>

          {shop.products.length === 0 && (
            <Text textAlign="center" mt="10" fontSize="3xl">
              No Producst found!!
            </Text>
          )}

          <Stack spacing="8" mt="5" mb="20">
            {shop.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={cart[product.id] ?? 0}
                upsertProduct={upsertProduct}
              />
            ))}
          </Stack>
        </Box>
      </main>
    </div>
  );
};

export function LoaderSpinner() {
  return (
    <Center height="100vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
}

export default ShopPage;
