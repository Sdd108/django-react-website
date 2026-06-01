import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleMarkdownProps {
  content: string;
}

const ArticleMarkdown = ({ content }: ArticleMarkdownProps) => {
  return (
    <Box
      className="article-markdown"
      color="fg.default"
      fontSize="md"
      lineHeight="relaxed"
      overflowX="auto"
      css={{
        // Markdown 输出的是标准 HTML 标签，这里集中定义文章正文排版。
        "& > *:first-child": { marginTop: 0 },
        "& > *:last-child": { marginBottom: 0 },
        "& p": { marginTop: "0.9rem", marginBottom: "0.9rem" },
        "& h1": {
          fontSize: "2rem",
          fontWeight: "700",
          lineHeight: "1.2",
          marginTop: "1.8rem",
          marginBottom: "0.9rem",
        },
        "& h2": {
          fontSize: "1.5rem",
          fontWeight: "700",
          lineHeight: "1.25",
          marginTop: "1.6rem",
          marginBottom: "0.75rem",
        },
        "& h3": {
          fontSize: "1.25rem",
          fontWeight: "650",
          lineHeight: "1.3",
          marginTop: "1.4rem",
          marginBottom: "0.6rem",
        },
        "& h4, & h5, & h6": {
          fontWeight: "650",
          lineHeight: "1.35",
          marginTop: "1.2rem",
          marginBottom: "0.5rem",
        },
        "& ul, & ol": {
          marginTop: "0.9rem",
          marginBottom: "0.9rem",
          paddingLeft: "1.5rem",
        },
        "& li": { marginTop: "0.35rem" },
        "& blockquote": {
          borderLeftWidth: "4px",
          borderColor: "blue.solid",
          color: "fg.muted",
          marginTop: "1rem",
          marginBottom: "1rem",
          paddingLeft: "1rem",
        },
        "& a": {
          color: "blue.solid",
          fontWeight: "500",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },
        "& code": {
          background: "bg.emphasized",
          borderRadius: "4px",
          fontSize: "0.9em",
          padding: "0.1rem 0.3rem",
        },
        "& pre": {
          background: "bg.emphasized",
          borderRadius: "6px",
          marginTop: "1rem",
          marginBottom: "1rem",
          overflowX: "auto",
          padding: "1rem",
        },
        "& pre code": {
          background: "transparent",
          padding: 0,
        },
        "& table": {
          borderCollapse: "collapse",
          marginTop: "1rem",
          marginBottom: "1rem",
          width: "100%",
        },
        "& th, & td": {
          borderWidth: "1px",
          borderColor: "border",
          padding: "0.5rem 0.75rem",
          textAlign: "left",
        },
        "& th": {
          background: "bg.subtle",
          fontWeight: "650",
        },
        "& hr": {
          borderColor: "border",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </Box>
  );
};

export default ArticleMarkdown;
