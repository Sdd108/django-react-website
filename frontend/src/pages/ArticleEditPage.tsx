import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  HStack,
  Input,
  Separator,
  SimpleGrid,
  Skeleton,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import ArticleMarkdown from "@/components/ArticleMarkdown";
import { toaster } from "@/components/ui/toaster";
import { apiFetch, readJsonOrFallback } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaCalendar,
  FaLink,
  FaSave,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";

interface ArticleFormData {
  title: string;
  author: string;
  published_date: string;
  source_url: string;
  content: string;
  is_published: boolean;
  is_pinned: boolean;
}

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
  author_user: string;
  is_published: boolean;
  is_pinned: boolean;
}

interface FieldErrors {
  // 字段名和 DRF validation error key 保持一致，便于直接渲染字段错误。
  title?: string;
  author?: string;
  published_date?: string;
  source_url?: string;
  content?: string;
  is_published?: string;
  is_pinned?: string;
  non_field_errors?: string;
}

const fetchArticle = async (id: string): Promise<Article> => {
  // 编辑页先加载当前文章，再把 API 数据映射到表单字段。
  const res = await apiFetch(`/articles/${id}/`);
  if (!res.ok) throw new Error("Article not found");
  return res.json();
};

const toDateTimeLocalValue = (dateStr: string) => {
  // datetime-local 需要 YYYY-MM-DDTHH:mm 格式；这里按用户本地时区展示。
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toFormData = (article: Article): ArticleFormData => ({
  title: article.title,
  author: article.author,
  published_date: toDateTimeLocalValue(article.published_date),
  source_url: article.source_url,
  content: article.content,
  is_published: article.is_published,
  is_pinned: article.is_pinned,
});

const updateArticle = async ({
  id,
  data,
}: {
  id: string;
  data: ArticleFormData;
}): Promise<Article> => {
  // 后端仍保存 Markdown 原文；只有 published_date 在提交前转换成 ISO 字符串。
  const payload = {
    ...data,
    published_date: data.published_date
      ? new Date(data.published_date).toISOString()
      : data.published_date,
  };

  const res = await apiFetch(`/articles/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // DRF 校验错误通常是 JSON；非 JSON 响应兜底成表单级错误。
    throw await readJsonOrFallback<FieldErrors>(res, {
      non_field_errors: ["Failed to update article."],
    });
  }

  return res.json();
};

const ArticleEditForm = ({ article }: { article: Article }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUsername = useAuthStore((state) => state.user?.username);
  const initialForm = toFormData(article);
  const [form, setForm] = useState<ArticleFormData>(() => initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: (updatedArticle) => {
      queryClient.setQueryData(
        ["article", String(updatedArticle.id)],
        updatedArticle,
      );
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toaster.create({
        title: "Article updated",
        description: "Your changes have been saved.",
        type: "success",
        duration: 5000,
      });
      navigate(`/articles/${updatedArticle.id}`);
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object") {
        // 将 { field: ["message"] } 压平成每个字段展示第一条错误。
        const errs = error as Record<string, string[] | string>;
        const mapped: FieldErrors = {};

        for (const [key, msgs] of Object.entries(errs)) {
          mapped[key as keyof FieldErrors] = Array.isArray(msgs)
            ? msgs[0]
            : msgs;
        }

        setFieldErrors(mapped);
      } else {
        toaster.create({
          title: "Something went wrong",
          description: "Please try again later.",
          type: "error",
          duration: 5000,
        });
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({});
    mutation.mutate({ id: String(article.id), data: form });
  };

  const handleCancel = () => {
    const hasUnsavedChanges =
      JSON.stringify(form) !== JSON.stringify(initialForm);

    if (
      hasUnsavedChanges &&
      !window.confirm("Discard your changes and return to the article?")
    ) {
      return;
    }

    navigate(`/articles/${article.id}`);
  };

  if (article.author_user !== currentUsername) {
    return (
      <Container maxW="800px" py={20}>
        <VStack gap={6} textAlign="center">
          <Heading size="2xl">You can't edit this article</Heading>
          <Text color="fg.muted" fontSize="lg">
            Only the article owner can change or delete it.
          </Text>
          <Link to={`/articles/${article.id}`}>
            <Button colorPalette="blue" variant="solid">
              Back to Article
            </Button>
          </Link>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1100px" py={12}>
      <VStack gap={8} alignItems="stretch">
        <Link to={`/articles/${article.id}`} style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">
            <FaArrowLeft style={{ marginRight: 6 }} />
            Back to Article
          </Button>
        </Link>

        <VStack gap={3} alignItems="flex-start">
          <Heading as="h1" size="4xl" fontWeight="extrabold">
            Edit Article
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Update the article content and review the Markdown preview.
          </Text>
        </VStack>

        <Separator />

        <form onSubmit={handleSubmit}>
          <VStack gap={6} alignItems="stretch">
            <VStack gap={5} alignItems="stretch">
              <Field.Root invalid={!!fieldErrors.title} required>
                <Field.Label>Title</Field.Label>
                <Input
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Article title"
                />
                {fieldErrors.title && (
                  <Field.ErrorText>{fieldErrors.title}</Field.ErrorText>
                )}
              </Field.Root>

              <HStack gap={5} alignItems="flex-start" flexWrap="wrap">
                <Field.Root
                  invalid={!!fieldErrors.author}
                  required
                  flex="1 1 240px"
                >
                  <Field.Label>
                    <FaUser size={12} style={{ marginRight: 6 }} />
                    Author
                  </Field.Label>
                  <Input
                    name="author"
                    required
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Author name"
                  />
                  {fieldErrors.author && (
                    <Field.ErrorText>{fieldErrors.author}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root
                  invalid={!!fieldErrors.published_date}
                  required
                  flex="1 1 240px"
                >
                  <Field.Label>
                    <FaCalendar size={12} style={{ marginRight: 6 }} />
                    Published Date
                  </Field.Label>
                  <Input
                    name="published_date"
                    type="datetime-local"
                    required
                    value={form.published_date}
                    onChange={handleChange}
                  />
                  {fieldErrors.published_date && (
                    <Field.ErrorText>
                      {fieldErrors.published_date}
                    </Field.ErrorText>
                  )}
                </Field.Root>
              </HStack>

              <Field.Root invalid={!!fieldErrors.source_url}>
                <Field.Label>
                  <FaLink size={12} style={{ marginRight: 6 }} />
                  Source URL{" "}
                  <Text as="span" color="fg.muted">
                    (optional)
                  </Text>
                </Field.Label>
                <Input
                  name="source_url"
                  type="url"
                  value={form.source_url}
                  onChange={handleChange}
                  placeholder="https://example.com/article"
                />
                {fieldErrors.source_url && (
                  <Field.ErrorText>{fieldErrors.source_url}</Field.ErrorText>
                )}
              </Field.Root>

              <HStack gap={6} flexWrap="wrap">
                <label>
                  <HStack gap={2}>
                    <input
                      name="is_published"
                      type="checkbox"
                      checked={form.is_published}
                      onChange={handleChange}
                    />
                    <Text>Published</Text>
                  </HStack>
                </label>
                <label>
                  <HStack gap={2}>
                    <input
                      name="is_pinned"
                      type="checkbox"
                      checked={form.is_pinned}
                      onChange={handleChange}
                    />
                    <Text>Pin to top</Text>
                  </HStack>
                </label>
              </HStack>
            </VStack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} alignItems="start">
              <Box
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p={5}
                minH="520px"
              >
                <Heading as="h2" size="lg" mb={4}>
                  Markdown Editor
                </Heading>

                <Field.Root invalid={!!fieldErrors.content} required>
                  <Field.Label>Content (Markdown)</Field.Label>
                  <Textarea
                    name="content"
                    required
                    value={form.content}
                    onChange={handleChange}
                    placeholder={
                      "Write Markdown, e.g. ## Heading\n\n- First point"
                    }
                    rows={18}
                  />
                  {fieldErrors.content && (
                    <Field.ErrorText>{fieldErrors.content}</Field.ErrorText>
                  )}
                </Field.Root>
              </Box>

              <Box
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p={5}
                minH="520px"
              >
                <Heading as="h2" size="lg" mb={4}>
                  Markdown Preview
                </Heading>
                <ArticleMarkdown
                  content={form.content || "_Nothing to preview yet._"}
                />
              </Box>
            </SimpleGrid>

            {fieldErrors.non_field_errors && (
              <Text color="fg.error">{fieldErrors.non_field_errors}</Text>
            )}

            <HStack gap={3} flexWrap="wrap">
              <Button
                type="submit"
                colorPalette="blue"
                size="lg"
                loading={mutation.isPending}
                loadingText="Saving..."
              >
                <FaSave style={{ marginRight: 6 }} />
                Save Changes
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleCancel}
                disabled={mutation.isPending}
              >
                <FaTimes style={{ marginRight: 6 }} />
                Cancel
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

const ArticleEditPage = () => {
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
      <Container maxW="1100px" py={12}>
        <VStack gap={6} alignItems="stretch">
          <Skeleton height="20px" width="120px" />
          <Skeleton height="48px" width="260px" />
          <Skeleton height="520px" />
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
            The article you're trying to edit doesn't exist or has been removed.
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

  return <ArticleEditForm article={article} />;
};

export default ArticleEditPage;
