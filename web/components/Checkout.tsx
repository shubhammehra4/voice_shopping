import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FormEvent } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useCheckoutContext } from "../context/checkout";

type CheckOutProps = {
  itemCount: number;
  cost: number;
  checkout: () => void;
};

function CheckoutModal({ itemCount, cost, checkout }: CheckOutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setCustomerDetails } = useCheckoutContext();

  function handleSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const contactNumber = data.get("contactNumber")?.toString() ?? "";
    const shippingAddress = data.get("shippingAddress")?.toString() ?? "";

    setCustomerDetails({ shippingAddress, contactNumber });
    e.currentTarget.reset();
    onClose();
    checkout();
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme="green">
        Checkout
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnEsc>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Checkout</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmission}>
            <ModalBody>
              <Stack spacing="5">
                <FormControl isRequired>
                  <FormLabel htmlFor="contactNumber">Contact Number</FormLabel>
                  <Input id="contactNumber" name="contactNumber" type="tel" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="shippingAddress">
                    Shipping Address
                  </FormLabel>
                  <Input
                    id="shippingAddress"
                    name="shippingAddress"
                    type="text"
                  />
                </FormControl>

                <Flex justifyContent="space-between">
                  <Text>{itemCount} items</Text>

                  <Text>
                    Total -{" "}
                    <Box
                      as="span"
                      color="gray.600"
                      fontWeight="bold"
                      mr="0.5"
                      fontSize="lg"
                    >
                      &#8377;
                    </Box>
                    {cost}
                  </Text>
                </Flex>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="green" type="submit">
                Confirm Checkout
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function Checkout({ itemCount, cost, checkout }: CheckOutProps) {
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
      <CheckoutModal cost={cost} itemCount={itemCount} checkout={checkout} />
    </Flex>
  );
}
