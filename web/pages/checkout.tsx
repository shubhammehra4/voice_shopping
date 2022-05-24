import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import SpeechRecognition, {
  SpeechRecognitionOptions,
  useSpeechRecognition,
} from "react-speech-recognition";
import { useCheckoutContext } from "../context/checkout";
import getShop from "../data/getShop";
import speakText from "../utils/speak";
import { LoaderSpinner } from "./shops/[shopId]";

const CheckoutPage: NextPage = () => {
  const router = useRouter();
  const { shopId } = router.query as { shopId: string };
  const { data: shop, isLoading } = useQuery(
    ["products", shopId],
    () => getShop(Number(shopId)),
    { enabled: typeof shopId !== "undefined" }
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
      callback: () => {},
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

  return <Box>{JSON.stringify({})}</Box>;
};

export default CheckoutPage;
