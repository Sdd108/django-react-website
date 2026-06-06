import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Separator,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import {
  FaCalendar,
  FaClock,
  FaEdit,
  FaPlus,
  FaThumbtack,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  author_user: string;
  published_date: string;
  last_updated: string;
  source_url: string;
  is_published: boolean;
  is_pinned: boolean;
}

interface PaginatedResponse {
  // DRF 分页响应固定包含 count/next/previous/results，列表页只渲染当前页 results。
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

const isArticleArray = (data: unknown): data is Article[] => {
  // 兼容未启用分页或测试桩直接返回数组的场景，避免有效数据被空状态吞掉。
  return Array.isArray(data);
};

const isPaginatedArticleResponse = (
  data: unknown,
): data is PaginatedResponse => {
  // DRF 分页响应必须带 results 数组；结构不对时显式进入错误态。
  return (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray((data as PaginatedResponse).results)
  );
};

const fetchArticles = async (path: string): Promise<Article[]> => {
  const res = await apiFetch(path);
  if (!res.ok) throw new Error("Failed to fetch articles");
  const data = (await res.json()) as unknown;

  // 后端当前使用分页响应；保留数组分支可以降低接口配置变化造成的展示故障。
  if (isPaginatedArticleResponse(data)) return data.results;
  if (isArticleArray(data)) return data;

  throw new Error("Unexpected articles response");
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getExcerpt = (content: string, maxLen = 200) => {
  // 列表页只展示纯文本摘要，避免把 Markdown 标记直接露出来。
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length > maxLen
    ? plainText.slice(0, maxLen).trimEnd() + "..."
    : plainText;
};

const ArticleCard = ({
  article,
  management = false,
}: {
  article: Article;
  management?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <Card.Root
      variant="elevated"
      width="100%"
      _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => navigate(`/articles/${article.id}`)}
    >
      <Card.Body gap={3}>
        <HStack justifyContent="space-between" alignItems="flex-start" gap={3}>
          <Heading as="h2" size="lg">
            {article.title}
          </Heading>
          <HStack gap={2} flexShrink={0}>
            {article.is_pinned && (
              <Badge colorPalette="purple" variant="subtle">
                <FaThumbtack style={{ marginRight: 4 }} />
                Pinned
              </Badge>
            )}
            {!article.is_published && (
              <Badge colorPalette="orange" variant="subtle">
                Draft
              </Badge>
            )}
          </HStack>
        </HStack>

        <HStack gap={4} color="fg.muted" fontSize="sm" flexWrap="wrap">
          <Box as="span" display="inline-flex" alignItems="center" gap={1}>
            <FaUser size={12} />
            {article.author}
            {article.author_user && (
              <Text as="span" color="fg.muted">
                @{article.author_user}
              </Text>
            )}
          </Box>
          <Box as="span" display="inline-flex" alignItems="center" gap={1}>
            <FaCalendar size={12} />
            Published {formatDate(article.published_date)}
          </Box>
          <Box as="span" display="inline-flex" alignItems="center" gap={1}>
            <FaClock size={12} />
            Last updated {formatDate(article.last_updated)}
          </Box>
        </HStack>

        <Text color="fg.muted" lineHeight="relaxed" lineClamp={3}>
          {getExcerpt(article.content)}
        </Text>

        <HStack gap={3} justifyContent="space-between" flexWrap="wrap">
          <Badge colorPalette="blue" variant="subtle" alignSelf="flex-start">
            Read more
          </Badge>
          {management && (
            <Link
              to={`/articles/${article.id}/edit`}
              style={{ textDecoration: "none" }}
              onClick={(event) => event.stopPropagation()}
            >
              <Button size="sm" variant="outline" colorPalette="blue">
                <FaEdit style={{ marginRight: 6 }} />
                Edit
              </Button>
            </Link>
          )}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

const LoadingState = () => (
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
);

const ArticlesPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const username = useAuthStore((state) => state.user?.username);

  const {
    data: publishedArticles,
    isLoading: isFeedLoading,
    isError: isFeedError,
    refetch: refetchFeed,
  } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: () => fetchArticles("/articles/?is_published=true"),
  });

  const {
    data: myArticles,
    isLoading: isMineLoading,
    isError: isMineError,
    refetch: refetchMine,
  } = useQuery({
    queryKey: ["articles", "mine", username],
    queryFn: () => fetchArticles("/articles/?my_articles=true"),
    enabled: isAuthenticated,
  });

  if (isFeedLoading) {
    return (
      <Container maxW="900px" py={12}>
        <LoadingState />
      </Container>
    );
  }

  if (isFeedError) {
    return (
      <Container maxW="900px" py={20}>
        <VStack gap={6} textAlign="center">
          <Heading size="2xl">Something went wrong</Heading>
          <Text color="fg.muted" fontSize="lg">
            Couldn't load articles. The server might be down.
          </Text>
          <Button colorPalette="blue" onClick={() => refetchFeed()}>
            Try Again
          </Button>
        </VStack>
      </Container>
    );
  }

  const hasPublishedArticles = !!publishedArticles?.length;
  const hasMyArticles = !!myArticles?.length;

  return (
    <Container maxW="900px" py={12}>
      <VStack gap={10} alignItems="stretch">
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

          {isAuthenticated && (
            <Link to="/articles/new" style={{ textDecoration: "none" }}>
              <Button colorPalette="blue">
                <FaPlus style={{ marginRight: 6 }} />
                Create Article
              </Button>
            </Link>
          )}
        </HStack>

        {isAuthenticated && (
          <VStack gap={4} alignItems="stretch">
            <HStack justifyContent="space-between" alignItems="center">
              <Heading as="h2" size="xl">
                My Articles
              </Heading>
              {isMineError && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => refetchMine()}
                >
                  Retry
                </Button>
              )}
            </HStack>

            {isMineLoading && <LoadingState />}
            {isMineError && (
              <Text color="fg.error">
                Couldn't load your article workspace.
              </Text>
            )}
            {!isMineLoading && !isMineError && !hasMyArticles && (
              <Text color="fg.muted">
                You haven't created any articles yet.
              </Text>
            )}
            {hasMyArticles && (
              <VStack gap={4}>
                {myArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} management />
                ))}
              </VStack>
            )}

            <Separator />
          </VStack>
        )}

        <VStack gap={4} alignItems="stretch">
          <Heading as="h2" size="xl">
            Published Feed
          </Heading>

          {!hasPublishedArticles && (
            <VStack gap={4} textAlign="center" py={10}>
              <Heading size="2xl">No Articles Yet</Heading>
              <Text color="fg.muted" fontSize="lg">
                Check back soon for new content.
              </Text>
            </VStack>
          )}

          {hasPublishedArticles && (
            <VStack gap={4}>
              {publishedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Container>
  );
};

export default ArticlesPage;
