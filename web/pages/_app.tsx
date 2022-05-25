import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
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
          <link rel="icon" type="image/png" sizes="32x32" href="/vercel.svg" />
          <link rel="icon" type="image/png" sizes="16x16" href="/vercel.svg" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/vercel.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <Component {...pageProps} />;
        </CheckoutContextWrapper>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
