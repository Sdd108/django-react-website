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
import ArticleMarkdown from "@/components/ArticleMarkdown";
import { toaster } from "@/components/ui/toaster";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
}

const fetchArticle = async (id: string): Promise<Article> => {
  // 详情页根据 URL 中的 id 请求单篇文章。
  const res = await fetch(`/api/articles/${id}/`);
  if (!res.ok) throw new Error("Article not found");
  return res.json();
};

const deleteArticle = async (id: number): Promise<void> => {
  // 删除操作不需要响应体；失败时交给 mutation 的 onError 展示提示。
  const res = await fetch(`/api/articles/${id}/`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete article");
};

const ArticleDetailPage = () => {
  // id 来自 /articles/:id；enabled 确保 id 存在时才发请求。
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toaster.create({
        title: "Article deleted",
        description: "The article has been removed.",
        type: "success",
        duration: 5000,
      });
      navigate("/articles");
    },
    onError: () => {
      toaster.create({
        title: "Delete failed",
        description: "Please try again later.",
        type: "error",
        duration: 5000,
      });
    },
  });

  const handleDelete = () => {
    if (!article) return;

    const confirmed = window.confirm(
      "Delete this article? This action cannot be undone.",
    );
    if (confirmed) {
      deleteMutation.mutate(article.id);
    }
  };

  if (isLoading) {
    // 用骨架屏占位标题、元信息和正文区域，避免加载时页面突然跳动。
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
    // 404 或网络错误都落到同一空状态，并提供回到列表的路径。
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
    // 详情页和列表页使用一致的日期展示格式。
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

          {/* source_url 是可选字段，只有存在时才展示外部来源链接。 */}
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

          <HStack gap={3} flexWrap="wrap" pt={2}>
            <Link
              to={`/articles/${article.id}/edit`}
              style={{ textDecoration: "none" }}
            >
              <Button colorPalette="blue" variant="outline" size="sm">
                <FaEdit style={{ marginRight: 6 }} />
                Edit
              </Button>
            </Link>
            <Button
              colorPalette="red"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
              loadingText="Deleting..."
            >
              <FaTrash style={{ marginRight: 6 }} />
              Delete
            </Button>
          </HStack>
        </VStack>

        <Separator />

        {/* 正文按 Markdown 渲染；原始 Markdown 仍由后端 content 字段保存。 */}
        <ArticleMarkdown content={article.content} />
      </VStack>
    </Container>
  );
};

export default ArticleDetailPage;
