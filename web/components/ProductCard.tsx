import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { Product } from "../data/getShop";

type ProductProps = {
  product: Product;
  quantity: number;
  upsertProduct: (id: number, quantity: number) => void;
};

export default function ProductCard({
  product,
  quantity,
  upsertProduct,
}: ProductProps) {
  const inStock = product.status === "inStock";

  return (
    <Box
      bg="white"
      maxW="sm"
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
      position="relative"
    >
      <Image
        src={product.imageUrl}
        alt={`Picture of ${product.name}`}
        roundedTop="lg"
        borderBottom="1px var(--chakra-colors-gray-400) solid"
      />

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          <Badge
            rounded="full"
            px="2"
            fontSize="0.8em"
            colorScheme={inStock ? "green" : "red"}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </Box>
        <Flex mt="1" justifyContent="space-between" alignContent="center">
          <Box
            fontSize="2xl"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {product.name}
          </Box>
          <Box fontSize="2xl" color="gray.800">
            <Box
              as="span"
              color="gray.600"
              fontWeight="bold"
              mr="0.5"
              fontSize="lg"
            >
              &#8377;
            </Box>
            {product.price}
          </Box>
        </Flex>

        <Box mt="4">
          {quantity === 0 ? (
            <Button
              leftIcon={<Icon as={IoIosAddCircle} fill="white" boxSize="6" />}
              colorScheme="messenger"
              w="full"
              onClick={() => upsertProduct(product.id, 1)}
            >
              Add to Cart
            </Button>
          ) : (
            <Flex
              w="full"
              justifyContent="flex-end"
              gap="5"
              alignItems="center"
            >
              <Text fontWeight="bold" fontSize="xl">
                Quantity -
              </Text>
              <IconButton
                aria-label="add-quantity"
                variant="unstyled"
                size="xs"
                icon={
                  <Icon as={IoIosRemoveCircle} boxSize="6" color="red.500" />
                }
                onClick={() => upsertProduct(product.id, quantity - 1)}
              />
              <Text fontWeight="bold" fontSize="xl">
                {quantity}
              </Text>
              <IconButton
                aria-label="add-quantity"
                variant="unstyled"
                size="xs"
                icon={
                  <Icon as={IoIosAddCircle} boxSize="6" color="green.500" />
                }
                onClick={() => upsertProduct(product.id, quantity + 1)}
              />
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  );
}
