import { Card, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { FaBookOpen } from "react-icons/fa";

const HomePage = () => {
  const features = [
    {
      title: "Latest Articles",
      description:
        "Explore our collection of in-depth technical articles about cursors and more.",
      icon: <FaBookOpen />,
    },
    {
      title: "Expert Insights",
      description:
        "Learn from industry experts about database management and frontend development.",
      icon: <FaBookOpen />,
    },
    {
      title: "Best Practices",
      description:
        "Discover best practices and tips for modern web development.",
      icon: <FaBookOpen />,
    },
  ];

  return (
    <Stack gap={8}>
      <Heading>Welcome to @sruta.cn</Heading>

      <Text>
        Exploring the world of web development through comprehensive articles
        and tutorials. From database management to frontend development.
      </Text>

      {/* <Link to="/articles">Explore Articles</Link> */}

      <HStack columns={{ base: 1, md: 3 }} gap={4}>
        {features.map((feature, index) => (
          <Card.Root key={index} padding={4}>
            <Card.Header>
              <HStack>
                {feature.icon}
                <Heading size="md">{feature.title}</Heading>
              </HStack>
            </Card.Header>

            <Card.Body>
              <Text>{feature.description}</Text>
            </Card.Body>
          </Card.Root>
        ))}
      </HStack>
    </Stack>
  );
};

export default HomePage;
