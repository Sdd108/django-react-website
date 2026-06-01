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
    // 顶层 Flex 让页脚在内容较少时仍贴近视口底部。
    <Flex direction="column" minH="100vh">
      <NavBar />

      {/* Outlet 渲染当前子路由页面，导航栏和页脚保持不变。 */}
      <Box as="main" flex="1">
        <Outlet />
      </Box>

      {/* 页脚放置品牌信息和社交入口，所有页面共享。 */}
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
