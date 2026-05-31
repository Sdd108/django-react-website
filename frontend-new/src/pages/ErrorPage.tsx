import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  const title = isRouteErrorResponse(error) ? "404" : "Error";
  const message = isRouteErrorResponse(error)
    ? "The page you're looking for doesn't exist."
    : "An unexpected error occurred. Please try again later.";

  return (
    <Center minH="70vh">
      <VStack gap={6} textAlign="center" px={4}>
        <Heading
          as="h1"
          size="6xl"
          fontWeight="extrabold"
          color="fg.muted"
          letterSpacing="tight"
        >
          {title}
        </Heading>
        <Text fontSize="lg" color="fg.muted" maxW="400px">
          {message}
        </Text>
        <Link to="/">
          <Button colorPalette="blue" variant="solid" size="lg">
            Go Home
          </Button>
        </Link>
      </VStack>
    </Center>
  );
};

export default ErrorPage;
