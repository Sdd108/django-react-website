import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import NavBar from "../components/NavBar";

const ErrorPage = () => {
  const error = useRouteError();

  // react-router 的 404 会被识别为 RouteErrorResponse，其余异常统一展示通用错误。
  const title = isRouteErrorResponse(error) ? "404" : "Error";
  const message = isRouteErrorResponse(error)
    ? "The page you're looking for doesn't exist."
    : "An unexpected error occurred. Please try again later.";

  return (
    <>
      <NavBar />
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
    </>
  );
};

export default ErrorPage;
