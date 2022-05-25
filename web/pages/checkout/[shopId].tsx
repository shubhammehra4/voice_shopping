import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsShop } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";
import { useMutation, useQuery } from "react-query";
import SpeechRecognition, {
  SpeechRecognitionOptions,
  useSpeechRecognition,
} from "react-speech-recognition";
import { useCheckoutContext } from "../../context/checkout";
import createOrder, { CreateOrder } from "../../data/createOrder";
import getShop from "../../data/getShop";
import speakText from "../../utils/speak";
import { LoaderSpinner } from "../shops/[shopId]";

const CheckoutPage: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { shopId } = router.query as { shopId: string };
  const { data: shop, isLoading } = useQuery(
    ["products", shopId],
    () => getShop(Number(shopId)),
    { enabled: typeof shopId !== "undefined" }
  );

  const createOrderMutation = useMutation((order: CreateOrder) =>
    createOrder(order)
  );

  const { getCart, getCustomerDetails } = useCheckoutContext();
  const cart = getCart();
  const customerDetails = getCustomerDetails();
  const [state, setState] = useState(customerDetails);

  const cartCost = Object.entries(cart).reduce<number>(
    (acc, [id, quantity]) =>
      acc +
      (shop?.products.find((p) => p.id === Number(id))?.price ?? 0) *
        (quantity ?? 0),
    0
  );

  async function confirmCheckout() {
    await createOrderMutation.mutateAsync({
      contactNumber: state.contactNumber,
      shippingAddress: state.shippingAddress,
      items: Object.entries(cart).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity: quantity ?? 0,
      })),
    });

    toast({
      title: "Order places",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    speakText("Congratulations your order is placed", {
      onEnd: () => router.push("/"),
    });
  }

  /**
   * Speech
   */
  const { stopListening, startListening } = SpeechRecognition;
  const commands: SpeechRecognitionOptions["commands"] = [
    {
      command: "my address is *",
      callback: (address: string) => {
        setState((state) => ({ ...state, shippingAddress: address }));

        speakText(`Please add your contact number by saying, "my number is "`, {
          onStart: stopListening,
          onEnd: () => startListening({ continuous: true }),
        });
      },
    },
    {
      command: "my number is *",
      callback: (number: string) => {
        setState((state) => ({ ...state, contactNumber: number }));

        speakText(
          `To confirm your order of value ${cartCost} rupees. Shipping address. ${state.shippingAddress}. Contact number, ${state.contactNumber}. Say "Confirm Order"`,
          {
            onStart: stopListening,
            onEnd: () => startListening({ continuous: true }),
          }
        );
      },
    },
    {
      command: "confirm order",
      callback: () => {
        speakText("Order is being confirmed", {
          onStart: stopListening,
          onEnd: () => confirmCheckout(),
        });
      },
    },
    {
      command: "(go) home",
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
    if (isFirstFullRender) {
      isFirstFullRender.current = false;

      if (Object.entries(cart).length === 0) {
        speakText("Your cart is empty, please add products before checkout");
        router.push("/");
      }

      if (customerDetails.shippingAddress) {
        speakText(
          `Please add your Shipping Address by saying, "my address is "`,
          { onEnd: () => startListening({ continuous: true }) }
        );
      }
    }
  }, [cart, customerDetails, router, shopId, startListening]);

  // -------------------------------------------------------

  if (isLoading || typeof shop === "undefined") return <LoaderSpinner />;

  return (
    <div style={{ position: "relative" }}>
      <Head>
        <title>{shop.name} Checkout</title>
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
                {shop.name} Checkout
              </Heading>
            </HStack>
          </Box>
          <Box fontSize="xs">
            <Text>{shop.merchantName}</Text>
            <Text>{shop.address}</Text>
          </Box>
        </Flex>

        <ConfirmCheckout
          cost={cartCost}
          itemCount={Object.entries(cart).length}
          confirmCheckout={confirmCheckout}
          isLoading={createOrderMutation.isLoading}
        />

        <Box mt="10" maxW="600px" mx="auto" px="5">
          <Heading fontSize="xl" my="5">
            Cart Items
          </Heading>

          <Stack spacing="8" mt="8" mb="20">
            {Object.entries(cart)
              .map(([id, quantity]) => ({
                product: shop.products.find((p) => p.id === Number(id))!,
                quantity,
              }))
              .map(({ product, quantity }) => (
                <Flex
                  key={product.id}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <HStack spacing={6} alignItems="start">
                    <Image
                      src={product.imageUrl}
                      w="20"
                      alt={`Picture of ${product.name}`}
                      rounded="md"
                    />
                    <Box>
                      <Box
                        fontSize="2xl"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                      >
                        {product.name}
                      </Box>
                      <Text>Quantity - {quantity}</Text>
                    </Box>
                  </HStack>

                  <Text>
                    <Box
                      as="span"
                      color="gray.600"
                      fontWeight="bold"
                      mr="0.5"
                      fontSize="lg"
                    >
                      &#8377;
                    </Box>
                    {(quantity ?? 0) * product.price}
                  </Text>
                </Flex>
              ))}
          </Stack>
        </Box>
      </main>
    </div>
  );
};

type ConfirmCheckoutProps = {
  itemCount: number;
  cost: number;
  isLoading: boolean;
  confirmCheckout: () => void;
};

function ConfirmCheckout({
  itemCount,
  cost,
  isLoading,
  confirmCheckout,
}: ConfirmCheckoutProps) {
  return (
    <Flex
      position="fixed"
      zIndex="50"
      bottom="0"
      bgColor="white"
      boxShadow="dark-lg"
      w="full"
      py="2"
      px="6"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box>
        <HStack fontSize="2xl">
          <Icon as={IoCartOutline} />
          <Text>Cart</Text>
        </HStack>

        <Text fontSize="xl">
          <Box
            as="span"
            color="gray.600"
            fontWeight="bold"
            mr="0.5"
            fontSize="lg"
          >
            &#8377;
          </Box>
          {cost} - {itemCount} items
        </Text>
      </Box>

      <Button
        onClick={confirmCheckout}
        colorScheme="green"
        isLoading={isLoading}
      >
        Confirm Checkout
      </Button>
    </Flex>
  );
}

export default CheckoutPage;
