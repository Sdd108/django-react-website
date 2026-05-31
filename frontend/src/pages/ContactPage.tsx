import { useState } from "react";
import {
  Button,
  Container,
  Field,
  Heading,
  Input,
  Separator,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  content: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  content?: string;
}

const submitContact = async (data: ContactFormData): Promise<void> => {
  const res = await fetch("/api/contact/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err; // Contains field-level validation errors
  }
};

const ContactPage = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    content: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      toaster.create({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
        type: "success",
        duration: 5000,
      });
      setForm({ name: "", email: "", phone: "", content: "" });
      setFieldErrors({});
    },
    onError: (error: unknown) => {
      // Handle DRF validation errors: { "field": ["error message"] }
      if (error && typeof error === "object") {
        const errs = error as Record<string, string[]>;
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
    // Clear field error on edit
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
    <Container maxW="700px" py={12}>
      <VStack gap={8} alignItems="stretch">
        <VStack gap={3} textAlign="center">
          <Heading as="h1" size="4xl" fontWeight="extrabold">
            Get in Touch
          </Heading>
          <Text fontSize="lg" color="fg.muted" maxW="500px">
            Have a question, suggestion, or just want to say hi? Fill in the
            form below and I'll get back to you.
          </Text>
        </VStack>

        <Separator />

        <form onSubmit={handleSubmit}>
          <VStack gap={5} alignItems="stretch">
            <Field.Root invalid={!!fieldErrors.name} required>
              <Field.Label>
                <FaUser size={12} style={{ marginRight: 6 }} />
                Name
              </Field.Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              {fieldErrors.name && (
                <Field.ErrorText>{fieldErrors.name}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root invalid={!!fieldErrors.email} required>
              <Field.Label>
                <FaEnvelope size={12} style={{ marginRight: 6 }} />
                Email
              </Field.Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <Field.ErrorText>{fieldErrors.email}</Field.ErrorText>
              )}
            </Field.Root>

            <Field.Root>
              <Field.Label>
                <FaPhone size={12} style={{ marginRight: 6 }} />
                Phone{" "}
                <Text as="span" color="fg.muted">
                  (optional)
                </Text>
              </Field.Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
              />
            </Field.Root>

            <Field.Root invalid={!!fieldErrors.content} required>
              <Field.Label>Message</Field.Label>
              <Textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="What would you like to say?"
                rows={6}
              />
              {fieldErrors.content && (
                <Field.ErrorText>{fieldErrors.content}</Field.ErrorText>
              )}
            </Field.Root>

            <Button
              type="submit"
              colorPalette="blue"
              size="lg"
              loading={mutation.isPending}
              loadingText="Sending..."
              width="100%"
            >
              Send Message
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default ContactPage;
