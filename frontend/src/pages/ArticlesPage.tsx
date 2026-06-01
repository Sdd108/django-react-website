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
import { FaCalendar, FaPlus, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
}

interface PaginatedResponse {
  // DRF 分页响应固定包含 count/next/previous/results，列表页只渲染当前页 results。
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

const fetchArticles = async (): Promise<Article[]> => {
  // Vite dev server 会把 /api 代理到 Django，因此前端不需要硬编码后端域名。
  const res = await fetch("/api/articles/");
  if (!res.ok) throw new Error("Failed to fetch articles");
  const data: PaginatedResponse = await res.json();
  return data.results;
};

const ArticlesPage = () => {
  const navigate = useNavigate();
  // React Query 管理加载、错误和缓存刷新状态，减少组件内手写副作用。
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  if (isLoading) {
    // 骨架屏保持和真实卡片相近的高度，降低数据加载时的布局跳动。
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
    // 请求失败时保留重试入口，适合后端暂时未启动或网络异常。
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
    // 空列表仍提供创建入口，方便首次初始化内容。
    return (
      <Container maxW="900px" py={20}>
        <VStack gap={4} textAlign="center">
          <Heading size="2xl">No Articles Yet</Heading>
          <Text color="fg.muted" fontSize="lg">
            Check back soon for new content.
          </Text>
          <Link to="/articles/new" style={{ textDecoration: "none" }}>
            <Button colorPalette="blue">
              <FaPlus style={{ marginRight: 6 }} />
              Create Article
            </Button>
          </Link>
        </VStack>
      </Container>
    );
  }

  const formatDate = (dateStr: string) => {
    // 统一使用美国英文日期格式，和当前英文界面文案保持一致。
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExcerpt = (content: string, maxLen = 200) => {
    // 列表页只展示摘要，详情页再展示完整正文。
    return content.length > maxLen
      ? content.slice(0, maxLen).trimEnd() + "..."
      : content;
  };

  return (
    <Container maxW="900px" py={12}>
      <VStack gap={8} alignItems="stretch">
        <HStack
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={4}
        >
          <VStack alignItems="flex-start" gap={2}>
            <Heading as="h1" size="3xl" fontWeight="extrabold">
              Articles
            </Heading>
            <Text color="fg.muted" fontSize="lg">
              In-depth articles on web development, databases, and more.
            </Text>
          </VStack>

          <Link to="/articles/new" style={{ textDecoration: "none" }}>
            <Button colorPalette="blue">
              <FaPlus style={{ marginRight: 6 }} />
              Create Article
            </Button>
          </Link>
        </HStack>

        <VStack gap={4}>
          {data.map((article) => (
            // 整张卡片可点击，减少用户必须点击小按钮的操作成本。
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

                <Text color="fg.muted" lineHeight="relaxed" lineClamp={3}>
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
