import { createContext, useContext, useRef } from "react";
import { Cart } from "../pages/shops/[shopId]";

interface CheckoutContextProps {
  children: React.ReactChild[] | React.ReactChild;
}

type CustomerDetails = {
  contactNumber: string;
  shippingAddress: string;
};

type CheckoutContext = {
  setCart: (cart: Cart) => void;
  getCart: () => Cart;
  getCustomerDetails: () => CustomerDetails;
  setCustomerDetails: (_deatils: CustomerDetails) => void;
};

const initialDetails: CustomerDetails = {
  shippingAddress: "",
  contactNumber: "",
};

const CheckoutContext = createContext<CheckoutContext>({
  getCart: () => ({}),
  setCart: (_cart: Cart) => {},
  getCustomerDetails: () => initialDetails,
  setCustomerDetails: (_details: CustomerDetails) => {},
});

const CheckoutContextWrapper = ({ children }: CheckoutContextProps) => {
  const cart = useRef<Cart>({});
  const customerDetails = useRef<CustomerDetails>(initialDetails);

  const getCart = () => cart.current;
  const setCart = (newCart: Cart) => {
    cart.current = newCart;
  };

  const getCustomerDetails = () => customerDetails.current;
  const setCustomerDetails = (details: CustomerDetails) => {
    customerDetails.current = details;
  };

  return (
    <CheckoutContext.Provider
      value={{
        getCart,
        setCart,
        getCustomerDetails,
        setCustomerDetails,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContextWrapper;
export const useCheckoutContext = () => useContext(CheckoutContext);
