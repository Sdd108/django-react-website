import { Typography, Card, Avatar, Space } from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Link } = Typography;

const About = () => {
  return (
    <div className="space-y-12 py-8 w-full">
      <div className="text-center mb-8">
        <Avatar
          size={160}
          src="https://avatars.githubusercontent.com/u/19226511"
          alt="Profile"
        />
        <Title level={1} className="mt-4">
          Zhipeng
        </Title>
        <Paragraph className="text-lg text-gray-600">
          Full Stack Developer | Open Source Enthusiast
        </Paragraph>
      </div>

      <Card className="mb-8">
        <Title level={2}>About Me</Title>
        <Paragraph className="text-lg">
          I'm a passionate full-stack developer with expertise in modern web
          technologies. My journey in software development started with a deep
          curiosity about how things work on the internet, and that curiosity
          has only grown stronger over time.
        </Paragraph>
        <Paragraph className="text-lg">
          Currently, I focus on building scalable web applications using
          technologies like React, Django, and TypeScript. I'm particularly
          interested in creating efficient, user-friendly interfaces and robust
          backend systems.
        </Paragraph>
      </Card>

      <Card className="mb-8">
        <Title level={2}>Skills</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Title level={3}>Frontend</Title>
            <ul className="list-disc pl-5">
              <li>React.js / Next.js</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Ant Design</li>
              <li>Redux / Context API</li>
            </ul>
          </div>
          <div>
            <Title level={3}>Backend</Title>
            <ul className="list-disc pl-5">
              <li>Django / Django REST Framework</li>
              <li>Python</li>
              <li>Node.js</li>
              <li>SQL / PostgreSQL</li>
              <li>RESTful APIs</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <Title level={2}>Connect With Me</Title>
        <Space size="large" className="flex justify-center">
          <Link href="https://github.com/Sdd108" target="_blank">
            <GithubOutlined className="text-2xl" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/zhipeng-liu-721226250/"
            target="_blank"
          >
            <LinkedinOutlined className="text-2xl" />
          </Link>
          <Link href="mailto:zhipeng108@outlook.com">
            <MailOutlined className="text-2xl" />
          </Link>
        </Space>
      </Card>
    </div>
  );
};

export default About;
