import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import "regenerator-runtime/runtime";
import CheckoutContextWrapper from "../context/checkout";
import "../styles/globals.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <CheckoutContextWrapper>
          <Head>
            <meta name="application-name" content="Shop Mart" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="default"
            />
            <meta name="apple-mobile-web-app-title" content="Shop Mart" />
            <meta
              name="description"
              content="One stop solution for all shopping needs"
            />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="theme-color" content="#000000" />

            <link rel="apple-touch-icon" href="/shopping-cart-48.png" />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/shopping-cart-48.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/shopping-cart-48.png"
            />
            <link rel="manifest" href="/manifest.json" />
            <link
              rel="mask-icon"
              href="/shopping-cart-48.png"
              color="#5bbad5"
            />
            <link rel="shortcut icon" href="/shopping-cart-48.png" />
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
            />
          </Head>
          <Component {...pageProps} />;
        </CheckoutContextWrapper>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
