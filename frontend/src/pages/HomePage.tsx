/*
 * @Author: “Zhipeng “zhipengmail@qq.com”
 * @Date: 2024-12-19 19:18:28
 * @LastEditors: “Zhipeng “zhipengmail@qq.com”
 * @LastEditTime: 2024-12-19 21:27:01
 * @FilePath: /django-react-website/frontend/src/pages/Home.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Typography, Card, Button } from "antd";
import { Link } from "react-router-dom";
import { ReadOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Home = () => {
  const features = [
    {
      title: "Latest Articles",
      description:
        "Explore our collection of in-depth technical articles about cursors and more.",
      icon: <ReadOutlined className="text-4xl text-blue-500" />,
    },
    {
      title: "Expert Insights",
      description:
        "Learn from industry experts about database management and frontend development.",
      icon: <ReadOutlined className="text-4xl text-green-500" />,
    },
    {
      title: "Best Practices",
      description:
        "Discover best practices and tips for modern web development.",
      icon: <ReadOutlined className="text-4xl text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-12 py-8 w-full">
      {/* Hero Section */}
      <div className="text-center space-y-4 px-4">
        <Title level={1}>
          Welcome to <span className="text-blue-500">@sruta.cn</span>
        </Title>
        <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
          Exploring the world of web development through comprehensive articles
          and tutorials. From database management to frontend development.
        </Paragraph>
        <Link to="/articles">
          <Button type="primary" size="large" icon={<RightOutlined />}>
            Explore Articles
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 px-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow w-full"
          >
            <div className="text-center space-y-4">
              {feature.icon}
              <Title level={3}>{feature.title}</Title>
              <Paragraph className="text-gray-600">
                {feature.description}
              </Paragraph>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
