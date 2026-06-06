import { ColorModeButton } from "@/components/ui/color-mode";
import {
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { Box, Heading, HStack, IconButton, Text } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Tooltip } from "@/components/ui/tooltip";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  // 导航配置集中维护，渲染时同时生成图标、文案和跳转链接。
  const menuItems = [
    { key: "/", label: "Home", icon: <AiOutlineHome /> },
    { key: "/articles", label: "Articles", icon: <AiOutlineFileText /> },
    { key: "/about", label: "About", icon: <AiOutlineUser /> },
    { key: "/contact", label: "Contact", icon: <AiOutlineMail /> },
  ];

  // 右侧认证区只保留紧凑操作入口，避免和主导航链接混在一起。
  const authItems = isAuthenticated
    ? []
    : [
        { key: "/login", label: "Login", icon: <AiOutlineLogin /> },
        { key: "/register", label: "Register", icon: <AiOutlineUserAdd /> },
      ];

  // 退出后回到首页，避免用户停留在需要登录态的页面。
  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <Box
      as="nav"
      px={6}
      py={4}
      position="sticky"
      top="0"
      zIndex="1000"
      bg="bg.subtle"
      borderBottomWidth="1px"
      borderColor="border"
      boxShadow="sm"
    >
      <HStack justifyContent="space-between" maxW="1200px" mx="auto">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Heading
            size="lg"
            fontWeight="bold"
            color="fg.default"
            letterSpacing="tight"
          >
            Sruta
          </Heading>
        </Link>

        <HStack
          gap={1}
          flex="1"
          minW={0}
          overflowX={{ base: "auto", md: "visible" }}
          px={{ base: 1, md: 3 }}
        >
          {menuItems.map((item) => {
            // 当前路径和菜单 key 完全一致时高亮；子路由保持普通状态，避免误导用户。
            const isActive = location.pathname === item.key;
            return (
              <Link
                key={item.key}
                to={item.key}
                style={{ textDecoration: "none" }}
              >
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight={isActive ? "semibold" : "normal"}
                  color={isActive ? "fg.default" : "fg.muted"}
                  bg={isActive ? "bg.emphasized" : "transparent"}
                  transition="all 0.2s"
                  _hover={{
                    bg: "bg.emphasized",
                    color: "fg.default",
                  }}
                >
                  {item.icon}
                  <Text as="span" display={{ base: "none", md: "inline" }}>
                    {item.label}
                  </Text>
                </Box>
              </Link>
            );
          })}
        </HStack>

        {/* 认证与主题控制独立成组，并用左边框和主导航做视觉区分。 */}
        <HStack
          gap={1}
          flexShrink={0}
          ms="auto"
          ps={{ base: 2, md: 3 }}
          borderLeftWidth="1px"
          borderColor="border"
        >
          {authItems.map((item) => (
            <Tooltip key={item.key} content={item.label} showArrow>
              <IconButton
                asChild
                aria-label={item.label}
                variant="ghost"
                size="xs"
                color="fg.muted"
                _hover={{
                  bg: "bg.emphasized",
                  color: "fg.default",
                }}
              >
                <Link to={item.key}>{item.icon}</Link>
              </IconButton>
            </Tooltip>
          ))}
          {isAuthenticated && (
            <>
              <Tooltip
                content={`Signed in as ${user?.username ?? "User"}`}
                showArrow
              >
                <Box
                  as="span"
                  aria-label={`User ${user?.username ?? ""}`.trim()}
                  display="inline-flex"
                  alignItems="center"
                  minH="8"
                  maxW={{ base: "96px", sm: "140px" }}
                  px={2}
                  borderRadius="md"
                  color="fg.muted"
                  fontSize="xs"
                  fontWeight="medium"
                  truncate
                >
                  {user?.username}
                </Box>
              </Tooltip>
              <Tooltip content="Logout" showArrow>
                <IconButton
                  type="button"
                  aria-label="Logout"
                  variant="ghost"
                  size="xs"
                  color="fg.muted"
                  onClick={handleLogout}
                  _hover={{
                    bg: "bg.emphasized",
                    color: "fg.default",
                  }}
                >
                  <AiOutlineLogout />
                </IconButton>
              </Tooltip>
            </>
          )}
          <ColorModeButton
            size="xs"
            color="fg.muted"
            title="Toggle color mode"
            _hover={{
              bg: "bg.emphasized",
              color: "fg.default",
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavBar;
