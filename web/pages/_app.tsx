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
      {/* <button className="visually-hidden" id="activity" /> */}
      <ChakraProvider>
        <CheckoutContextWrapper>
          <Component {...pageProps} />;
        </CheckoutContextWrapper>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
