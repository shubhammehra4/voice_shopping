import {
  Box,
  Flex,
  Grid,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Tag,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { BsShopWindow } from "react-icons/bs";
import { GiShoppingCart } from "react-icons/gi";
import { useQuery } from "react-query";
import SpeechRecognition, {
  SpeechRecognitionOptions,
  useSpeechRecognition,
} from "react-speech-recognition";
import getShops from "../data/getShops";
import styles from "../styles/Home.module.css";
import speakText from "../utils/speak";
import { LoaderSpinner } from "./shops/[shopId]";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: shops, isLoading } = useQuery("shops", getShops);

  /**
   * Speech
   */
  const { stopListening, startListening } = SpeechRecognition;
  const commands: SpeechRecognitionOptions["commands"] = [
    {
      command: "visit *",
      callback: (shopName: string) => {
        console.log(shopName);
        const shop = shops?.find(
          (shop) =>
            shop.name.toLowerCase().replaceAll(" ", "") ===
            shopName.toLowerCase().replaceAll(" ", "")
        );

        if (typeof shop === "undefined") {
          speakText("No Shop with the name found, please try again!", {
            onStart: stopListening,
            onEnd: () => startListening({ continuous: true }),
          });
          return;
        }

        speakText(`Visiting, ${shop.name}`, {
          onStart: stopListening,
          onEnd: () => {
            router.push(`/shops/${shop.id}`);
          },
        });
      },
    },
  ];

  const { listening } = useSpeechRecognition({
    commands,
    clearTranscriptOnListen: true,
  });

  const isFirstFullRender = useRef(true);
  useEffect(() => {
    if (typeof shops !== "undefined" && isFirstFullRender) {
      isFirstFullRender.current = false;
      speakText(
        `Hello, Welcome to Shop Mart the one stop solution for your shopping needs.
        Choose from the following shops ${shops.reduce<string>(
          (acc, shop) => acc + shop.name + ", ",
          ""
        )}.
        To Choose a shop say, "Visit with shop name"`,
        { onEnd: () => startListening({ continuous: true }) }
      );
    }
  }, [shops, startListening]);

  // -------------------------------------------------------

  if (isLoading || typeof shops === "undefined") return <LoaderSpinner />;

  return (
    <div className={styles.container}>
      <Head>
        <title>ShopMart</title>
        <meta name="description" content="One stop for all shopping needs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.hero}>
          <BsShopWindow color="#0070f3" />
          <h1 className={styles.title}>
            Shop <span>Mart</span>
          </h1>
        </div>
        <h3 className={styles.description}>
          One stop for all your shopping needs
        </h3>

        <Grid gap={3} mb="8">
          {shops.map((shop) => (
            <Link key={shop.id} href={`/shops/${shop.id}`} passHref>
              <LinkBox cursor="pointer">
                <Box className={styles.card} minWidth="350px">
                  <Flex justifyContent="space-between" w="full">
                    <LinkOverlay>
                      <Flex gap={3}>
                        <Icon boxSize={6} color="#0070f3" as={GiShoppingCart} />
                        <Heading fontSize="2xl">{shop.name}</Heading>
                      </Flex>
                    </LinkOverlay>
                    <Tag
                      colorScheme={shop.status === "open" ? "green" : "orange"}
                      variant="outline"
                    >
                      {shop.status}
                    </Tag>
                  </Flex>

                  <Text>{shop.merchantName}</Text>
                  <Text mt="4">{shop.address}</Text>
                </Box>
              </LinkBox>
            </Link>
          ))}
        </Grid>
      </main>
    </div>
  );
};

export default Home;
