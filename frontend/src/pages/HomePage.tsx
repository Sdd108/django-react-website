import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaBookOpen, FaLightbulb, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomePage = () => {
  // 首页特性卡片使用数据驱动渲染，后续增删卡片只需改数组。
  const features = [
    {
      title: "Latest Articles",
      description:
        "In-depth technical articles on database management, frontend development, and modern web technologies.",
      icon: <FaBookOpen size={24} />,
    },
    {
      title: "Expert Insights",
      description:
        "Learn from hands-on experience with real-world projects and practical coding techniques.",
      icon: <FaLightbulb size={24} />,
    },
    {
      title: "Best Practices",
      description:
        "Discover proven patterns, clean code principles, and tips for building better software.",
      icon: <FaCheckCircle size={24} />,
    },
  ];

  return (
    <Stack gap={0}>
      {/* 首屏区域：展示站点定位，并引导用户进入文章列表。 */}
      <VStack py={{ base: 16, md: 24 }} gap={6} textAlign="center">
        <Container maxW="700px">
          <Heading
            as="h1"
            size={{ base: "4xl", md: "5xl" }}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="1.1"
          >
            Welcome to Sruta
          </Heading>
          <Text
            mt={4}
            fontSize={{ base: "lg", md: "xl" }}
            color="fg.muted"
            lineHeight="relaxed"
          >
            Exploring the world of web development through comprehensive
            articles and tutorials. From database architecture to modern
            frontend frameworks.
          </Text>
          <Link to="/articles">
            <Button size="lg" mt={8} colorPalette="blue" variant="solid">
              Explore Articles
            </Button>
          </Link>
        </Container>
      </VStack>

      <Separator />

      {/* 特性区域：用三张卡片概括站点内容类型。 */}
      <Container maxW="1100px" py={{ base: 12, md: 20 }}>
        <VStack gap={4} mb={12} textAlign="center">
          <Heading as="h2" size="3xl" fontWeight="semibold">
            What you'll find here
          </Heading>
          <Text fontSize="lg" color="fg.muted" maxW="600px">
            A growing collection of resources to help you build better software.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {features.map((feature, index) => (
            <Card.Root key={index} variant="elevated" size="lg">
              <Card.Body gap={4}>
                <Box
                  as="span"
                  color="blue.solid"
                  bg="blue.subtle"
                  p={3}
                  borderRadius="lg"
                  display="inline-flex"
                >
                  {feature.icon}
                </Box>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Description>{feature.description}</Card.Description>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Container>
    </Stack>
  );
};

export default HomePage;
