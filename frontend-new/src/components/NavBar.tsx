import { ColorModeButton } from "@/components/ui/color-mode";
import {
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineMail,
} from "react-icons/ai";
import { Box, Heading, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const menuItems = [
    { key: "/", label: "Home", icon: <AiOutlineHome /> },
    { key: "/articles", label: "Articles", icon: <AiOutlineFileText /> },
    { key: "/about", label: "About", icon: <AiOutlineUser /> },
    { key: "/contact", label: "Contact", icon: <AiOutlineMail /> },
  ];

  return (
    <Box
      padding={5}
      position="sticky"
      top="0"
      zIndex="1000"
      bg="cyan.solid"
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <HStack justifyContent="space-between">
        <Link to="/">
          <Heading color={"white"}>Sruta</Heading>
        </Link>
        <HStack gap={5}>
          {menuItems.map((item) => (
            <Box color="gray.contrast" key={item.key}>
              <HStack>
                {item.icon}
                {item.label}
              </HStack>
            </Box>
          ))}
          <ColorModeButton />
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavBar;
