import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import getShops from "../data/getShops";
import styles from "../styles/Home.module.css";
import speakText from "../utils/speak";
import { BsShopWindow } from "react-icons/bs";
import Link from "next/link";
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
import { GiShoppingCart } from "react-icons/gi";
import SpeechRecognition, {
  SpeechRecognitionOptions,
  useSpeechRecognition,
} from "react-speech-recognition";

const Home: NextPage = () => {
  const { data: shops } = useQuery("shops", getShops);

  const resetListening = () => {
    SpeechRecognition.stopListening();

    setTimeout(() => SpeechRecognition.startListening(), 300);
  };

  const startListening = () => {
    SpeechRecognition.startListening();
  };

  const commands: SpeechRecognitionOptions["commands"] = [
    {
      command: "hello (shop mart)",
      callback: () => {
        speakText("hello shubham, to repeat say repeat", {
          onEnd: resetListening,
        });
      },
    },
    {
      command: "repeat",
      callback: resetListening,
    },
  ];

  const { listening } = useSpeechRecognition({
    commands,
    clearTranscriptOnListen: true,
  });

  // const stopListening = () => {
  //   SpeechRecognition.stopListening();
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     startListening();
  //   }, 2000);
  // }, []);

  // useEffect(() => {
  //   const button = document.querySelector<HTMLButtonElement>("#activity");

  //   const speakEvent = setTimeout(() => {
  //     button?.click();
  //     speakText("hello shubham");
  //   }, 1000);

  //   return () => clearTimeout(speakEvent);
  // }, []);

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
            Shop <span>Mart</span> {listening ? "speak" : ""}
          </h1>
        </div>
        <h3 className={styles.description}>
          One stop for all your shopping needs
        </h3>

        <Grid gap={3} mb="8">
          {shops &&
            shops.map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.id}`} passHref>
                <LinkBox cursor="pointer">
                  <Box className={styles.card} minWidth="350px">
                    <Flex justifyContent="space-between" w="full">
                      <LinkOverlay>
                        <Flex gap={3}>
                          <Icon
                            boxSize={6}
                            color="#0070f3"
                            as={GiShoppingCart}
                          />
                          <Heading fontSize="2xl">{shop.name}</Heading>
                        </Flex>
                      </LinkOverlay>
                      <Tag
                        colorScheme={
                          shop.status === "open" ? "green" : "orange"
                        }
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
