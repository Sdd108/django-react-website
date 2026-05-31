import { Box, Container, Flex, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  AiOutlineGithub,
  AiOutlineMail,
  AiOutlineTwitter,
} from "react-icons/ai";

const Layout = () => {
  return (
    <Flex direction="column" minH="100vh">
      <NavBar />

      <Box as="main" flex="1">
        <Outlet />
      </Box>

      <Box
        as="footer"
        borderTopWidth="1px"
        borderColor="border"
        bg="bg.subtle"
        mt="auto"
      >
        <Container maxW="1200px" py={8}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "center", md: "flex-start" }}
            gap={6}
          >
            <Box textAlign={{ base: "center", md: "left" }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Text fontWeight="bold" fontSize="lg" color="fg.default">
                  Sruta
                </Text>
              </Link>
              <Text fontSize="sm" color="fg.muted" mt={1}>
                © {new Date().getFullYear()} sruta.cn — All rights reserved.
              </Text>
            </Box>

            <HStack gap={4} color="fg.muted">
              <a href="#" style={{ color: "inherit", display: "flex" }}>
                <AiOutlineGithub size={20} />
              </a>
              <a href="#" style={{ color: "inherit", display: "flex" }}>
                <AiOutlineTwitter size={20} />
              </a>
              <a href="#" style={{ color: "inherit", display: "flex" }}>
                <AiOutlineMail size={20} />
              </a>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
};

export default Layout;
