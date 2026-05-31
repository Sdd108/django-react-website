import { ColorModeButton } from "@/components/ui/color-mode";
import {
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineMail,
} from "react-icons/ai";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();

  const menuItems = [
    { key: "/", label: "Home", icon: <AiOutlineHome /> },
    { key: "/articles", label: "Articles", icon: <AiOutlineFileText /> },
    { key: "/about", label: "About", icon: <AiOutlineUser /> },
    { key: "/contact", label: "Contact", icon: <AiOutlineMail /> },
  ];

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

        <HStack gap={1}>
          {menuItems.map((item) => {
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
                  <Text as="span">{item.label}</Text>
                </Box>
              </Link>
            );
          })}
          <ColorModeButton />
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavBar;
