import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "@/hooks/useTheme";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={theme === "light" ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      className="text-white hover:text-gray-300"
    />
  );
};

export default ThemeSwitch;
