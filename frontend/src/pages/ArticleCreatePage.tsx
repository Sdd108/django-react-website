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
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import ArticleMarkdown from "@/components/ArticleMarkdown";
import { apiFetch, readJsonOrFallback } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaArrowLeft, FaCalendar, FaLink, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";

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
  is_published: boolean;
  is_pinned: boolean;
}

interface FieldErrors {
  // 字段名与 DRF validation error key 保持一致，便于直接映射到 Chakra Field。
  title?: string;
  author?: string;
  published_date?: string;
  source_url?: string;
  content?: string;
  is_published?: string;
  is_pinned?: string;
  non_field_errors?: string;
}

const createArticle = async (data: ArticleFormData): Promise<Article> => {
  // datetime-local 没有时区信息，提交前转换成 ISO 字符串交给 Django DateTimeField。
  const payload = {
    ...data,
    published_date: data.published_date
      ? new Date(data.published_date).toISOString()
      : data.published_date,
  };

  const res = await apiFetch("/articles/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // DRF 通常返回 JSON 字段错误；非 JSON 错误兜底为表单级错误。
    throw await readJsonOrFallback<FieldErrors>(res, {
      non_field_errors: ["Failed to create article."],
    });
  }

  return res.json();
};

const ArticleCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  // 表单状态保持为字符串，和 input/textarea 的 value 类型一致。
  const [form, setForm] = useState<ArticleFormData>({
    title: "",
    author: user?.username ?? "",
    published_date: "",
    source_url: "",
    content: "",
    is_published: true,
    is_pinned: false,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (article) => {
      // 创建成功后刷新文章列表缓存，并跳转到刚创建的详情页。
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toaster.create({
        title: "Article created",
        description: "Your article is now available.",
        type: "success",
        duration: 5000,
      });
      navigate(`/articles/${article.id}`);
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object") {
        // 将 DRF 的 { field: ["message"] } 压平成每个字段展示第一条错误。
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

    // 用户修改字段时清除该字段旧错误，避免已经修正后仍显示错误文案。
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 每次提交前清空旧错误，避免后端新响应和旧状态混在一起。
    setFieldErrors({});
    mutation.mutate(form);
  };

  return (
    <Container maxW="1100px" py={12}>
      <VStack gap={8} alignItems="stretch">
        <Link to="/articles" style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm">
            <FaArrowLeft style={{ marginRight: 6 }} />
            Back to Articles
          </Button>
        </Link>

        <VStack gap={3} alignItems="flex-start">
          <Heading as="h1" size="4xl" fontWeight="extrabold">
            Create Article
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Publish a new article to the site.
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
                      "Write Markdown, e.g. ## Heading\\n\\n- First point"
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

            <Button
              type="submit"
              colorPalette="blue"
              size="lg"
              loading={mutation.isPending}
              loadingText="Publishing..."
              width="100%"
            >
              Publish Article
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default ArticleCreatePage;
