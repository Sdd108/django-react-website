import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FaCalendar, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

const fetchArticles = async (): Promise<Article[]> => {
  const res = await fetch("/api/articles/");
  if (!res.ok) throw new Error("Failed to fetch articles");
  const data: PaginatedResponse = await res.json();
  return data.results;
};

const ArticlesPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  if (isLoading) {
    return (
      <Container maxW="900px" py={12}>
        <VStack gap={6} alignItems="stretch">
          <Skeleton height="40px" width="200px" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Card.Root key={i} variant="elevated">
              <Card.Body gap={3}>
                <Skeleton height="24px" width="60%" />
                <Skeleton height="16px" width="40%" />
                <Skeleton height="60px" />
              </Card.Body>
            </Card.Root>
          ))}
        </VStack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="900px" py={20}>
        <VStack gap={6} textAlign="center">
          <Heading size="2xl">Something went wrong</Heading>
          <Text color="fg.muted" fontSize="lg">
            Couldn't load articles. The server might be down.
          </Text>
          <Button colorPalette="blue" onClick={() => refetch()}>
            Try Again
          </Button>
        </VStack>
      </Container>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Container maxW="900px" py={20}>
        <VStack gap={4} textAlign="center">
          <Heading size="2xl">No Articles Yet</Heading>
          <Text color="fg.muted" fontSize="lg">
            Check back soon for new content.
          </Text>
        </VStack>
      </Container>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExcerpt = (content: string, maxLen = 200) => {
    return content.length > maxLen
      ? content.slice(0, maxLen).trimEnd() + "..."
      : content;
  };

  return (
    <Container maxW="900px" py={12}>
      <VStack gap={8} alignItems="stretch">
        <Heading as="h1" size="3xl" fontWeight="extrabold">
          Articles
        </Heading>
        <Text color="fg.muted" fontSize="lg">
          In-depth articles on web development, databases, and more.
        </Text>

        <VStack gap={4}>
          {data.map((article) => (
            <Card.Root
              key={article.id}
              variant="elevated"
              width="100%"
              _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => navigate(`/articles/${article.id}`)}
            >
              <Card.Body gap={3}>
                <Heading as="h2" size="lg">
                  {article.title}
                </Heading>

                <HStack gap={4} color="fg.muted" fontSize="sm">
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <FaUser size={12} />
                    {article.author}
                  </Box>
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <FaCalendar size={12} />
                    {formatDate(article.published_date)}
                  </Box>
                </HStack>

                <Text
                  color="fg.muted"
                  lineHeight="relaxed"
                  lineClamp={3}
                >
                  {getExcerpt(article.content)}
                </Text>

                <Badge
                  colorPalette="blue"
                  variant="subtle"
                  alignSelf="flex-start"
                >
                  Read more →
                </Badge>
              </Card.Body>
            </Card.Root>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default ArticlesPage;
