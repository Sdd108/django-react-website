import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Separator,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaCalendar, FaUser } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
}

const fetchArticle = async (id: string): Promise<Article> => {
  const res = await fetch(`/api/articles/${id}/`);
  if (!res.ok) throw new Error("Article not found");
  return res.json();
};

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Container maxW="800px" py={12}>
        <VStack gap={6} alignItems="stretch">
          <Skeleton height="20px" width="100px" />
          <Skeleton height="48px" width="80%" />
          <Skeleton height="20px" width="40%" />
          <Skeleton height="400px" />
        </VStack>
      </Container>
    );
  }

  if (isError || !article) {
    return (
      <Container maxW="800px" py={20}>
        <VStack gap={6} textAlign="center">
          <Heading size="2xl">Article Not Found</Heading>
          <Text color="fg.muted" fontSize="lg">
            The article you're looking for doesn't exist or has been removed.
          </Text>
          <Link to="/articles">
            <Button colorPalette="blue" variant="solid">
              Back to Articles
            </Button>
          </Link>
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

  return (
    <Container maxW="800px" py={12}>
      <VStack gap={8} alignItems="stretch">
        <Link to="/articles" style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">
            <FaArrowLeft style={{ marginRight: 6 }} />
            Back to Articles
          </Button>
        </Link>

        <VStack gap={3} alignItems="flex-start">
          <Heading
            as="h1"
            size="4xl"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            {article.title}
          </Heading>

          <HStack gap={4} color="fg.muted" fontSize="sm">
            <Box as="span" display="inline-flex" alignItems="center" gap={1}>
              <FaUser size={12} />
              {article.author}
            </Box>
            <Box as="span" display="inline-flex" alignItems="center" gap={1}>
              <FaCalendar size={12} />
              {formatDate(article.published_date)}
            </Box>
          </HStack>

          {article.source_url && (
            <Badge colorPalette="blue" variant="subtle">
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                View Source
              </a>
            </Badge>
          )}
        </VStack>

        <Separator />

        <Text fontSize="md" lineHeight="relaxed" whiteSpace="pre-wrap">
          {article.content}
        </Text>
      </VStack>
    </Container>
  );
};

export default ArticleDetailPage;
