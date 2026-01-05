import { ColorModeButton } from "@/components/ui/color-mode";
import {
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineUser,
  AiOutlineMail,
} from "react-icons/ai";
import { Heading, HStack } from "@chakra-ui/react";

const NavBar = () => {
  const menuItems = [
    { key: "/", label: "Home", icon: <AiOutlineHome /> },
    { key: "/articles", label: "Articles", icon: <AiOutlineFileText /> },
    { key: "/about", label: "About", icon: <AiOutlineUser /> },
    { key: "/contact", label: "Contact", icon: <AiOutlineMail /> },
  ];

  return (
    <HStack justifyContent="space-between">
      <Heading>Sruta</Heading>
      <HStack gap={5}>
        {menuItems.map((item) => (
          <HStack>
            {item.icon}
            {item.label}
          </HStack>
        ))}
        <ColorModeButton />
      </HStack>
    </HStack>
  );
};

export default NavBar;
