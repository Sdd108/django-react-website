import {
  Box,
  Container,
  Heading,
  Separator,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaCode,
  FaDatabase,
  FaPaintBrush,
  FaServer,
  FaTools,
} from "react-icons/fa";

const AboutPage = () => {
  const skills = [
    { label: "Python", icon: <FaCode /> },
    { label: "Django", icon: <FaServer /> },
    { label: "React", icon: <FaPaintBrush /> },
    { label: "TypeScript", icon: <FaCode /> },
    { label: "PostgreSQL", icon: <FaDatabase /> },
    { label: "Docker", icon: <FaTools /> },
    { label: "Git", icon: <FaTools /> },
    { label: "REST APIs", icon: <FaServer /> },
  ];

  const experience = [
    {
      title: "Software Engineer",
      period: "2022 — Present",
      company: "Self-employed / Freelance",
      description:
        "Building full-stack web applications with Django REST Framework and React. Focused on clean architecture, test-driven development, and performant frontends.",
    },
    {
      title: "Backend Developer",
      period: "2020 — 2022",
      company: "Previous Role",
      description:
        "Developed and maintained REST APIs serving thousands of users. Migrated legacy systems to Django, optimized database queries, and mentored junior developers.",
    },
  ];

  return (
    <Container maxW="900px" py={12}>
      <VStack gap={12} alignItems="stretch">
        {/* Hero */}
        <VStack gap={4} textAlign="center">
          <Heading as="h1" size="4xl" fontWeight="extrabold">
            About Me
          </Heading>
          <Text
            fontSize="lg"
            color="fg.muted"
            maxW="600px"
            lineHeight="relaxed"
          >
            Hi, I'm Zhipeng — a full-stack developer passionate about building
            clean, fast, and useful software.
          </Text>
        </VStack>

        <Separator />

        {/* Bio */}
        <VStack gap={4} alignItems="flex-start">
          <Heading as="h2" size="2xl">
            Who I am
          </Heading>
          <Text fontSize="md" color="fg.muted" lineHeight="relaxed">
            I'm a software engineer specializing in web development with Python
            (Django) and modern JavaScript (React, TypeScript). I enjoy turning
            complex problems into simple, elegant solutions.
          </Text>
          <Text fontSize="md" color="fg.muted" lineHeight="relaxed">
            When I'm not coding, you'll find me exploring new technologies,
            writing technical articles, or contributing to open-source projects.
            This website is where I share what I learn along the way.
          </Text>
        </VStack>

        {/* Skills */}
        <VStack gap={4} alignItems="flex-start">
          <Heading as="h2" size="2xl">
            Skills &amp; Tools
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} width="100%">
            {skills.map((skill) => (
              <Box
                key={skill.label}
                bg="blue.subtle"
                color="blue.solid"
                py={2}
                px={4}
                borderRadius="md"
                display="flex"
                alignItems="center"
                gap={2}
                fontSize="sm"
                fontWeight="medium"
              >
                {skill.icon}
                {skill.label}
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Experience */}
        <VStack gap={4} alignItems="flex-start">
          <Heading as="h2" size="2xl">
            Experience
          </Heading>
          <VStack gap={6} alignItems="stretch" width="100%">
            {experience.map((exp) => (
              <Box
                key={exp.title}
                borderLeftWidth="3px"
                borderColor="blue.solid"
                pl={6}
                py={2}
              >
                <Heading as="h3" size="md">
                  {exp.title}
                </Heading>
                <Text fontSize="sm" color="fg.muted" mt={1}>
                  {exp.company} — {exp.period}
                </Text>
                <Text
                  fontSize="sm"
                  color="fg.muted"
                  mt={2}
                  lineHeight="relaxed"
                >
                  {exp.description}
                </Text>
              </Box>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </Container>
  );
};

export default AboutPage;
