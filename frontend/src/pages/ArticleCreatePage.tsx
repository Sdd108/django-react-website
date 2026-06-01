import { useState } from "react";
import {
  Button,
  Container,
  Field,
  Heading,
  HStack,
  Input,
  Separator,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
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
}

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published_date: string;
  source_url: string;
}

interface FieldErrors {
  title?: string;
  author?: string;
  published_date?: string;
  source_url?: string;
  content?: string;
  non_field_errors?: string;
}

const createArticle = async (data: ArticleFormData): Promise<Article> => {
  const payload = {
    ...data,
    published_date: data.published_date
      ? new Date(data.published_date).toISOString()
      : data.published_date,
  };

  const res = await fetch("/api/articles/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await res
      .json()
      .catch(() => ({ non_field_errors: ["Failed to create article."] }));
  }

  return res.json();
};

const ArticleCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ArticleFormData>({
    title: "",
    author: "",
    published_date: "",
    source_url: "",
    content: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (article) => {
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    mutation.mutate(form);
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
          <Heading as="h1" size="4xl" fontWeight="extrabold">
            Create Article
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Publish a new article to the site.
          </Text>
        </VStack>

        <Separator />

        <form onSubmit={handleSubmit}>
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

            <Field.Root invalid={!!fieldErrors.content} required>
              <Field.Label>Content</Field.Label>
              <Textarea
                name="content"
                required
                value={form.content}
                onChange={handleChange}
                placeholder="Write the article content..."
                rows={12}
              />
              {fieldErrors.content && (
                <Field.ErrorText>{fieldErrors.content}</Field.ErrorText>
              )}
            </Field.Root>

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
