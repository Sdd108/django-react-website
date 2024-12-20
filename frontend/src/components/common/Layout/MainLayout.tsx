import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import ThemeSwitch from "../ThemeSwitch";

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  const menuItems = [
    { key: "/", label: "Home", icon: <HomeOutlined /> },
    { key: "/articles", label: "Articles", icon: <FileTextOutlined /> },
    { key: "/about", label: "About", icon: <UserOutlined /> },
    { key: "/contact", label: "Contact", icon: <MailOutlined /> },
  ];

  return (
    <Layout>
      <Header className="w-full z-10 px-4 flex items-center fixed top-0 left-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="text-white text-2xl font-bold">
            SRUTA
          </Link>
          <div className="flex items-center">
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              className="flex-1 justify-end bg-transparent border-none ml-auto"
              style={{ minWidth: "400px" }}
              items={menuItems.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: <Link to={item.key}>{item.label}</Link>,
              }))}
            />
            <ThemeSwitch />
          </div>
        </div>
      </Header>
      <Content className="min-h-screen" style={{ marginTop: 64 }}>
        <div className="max-w-7xl mx-auto px-4">{children}</div>
      </Content>
      <Footer className="text-center bg-gray-100">
        ©{new Date().getFullYear()} @sruta.cn All rights reserved.
      </Footer>
    </Layout>
  );
};

export default MainLayout;
