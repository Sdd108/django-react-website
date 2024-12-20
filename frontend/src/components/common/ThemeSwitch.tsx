/*
 * @Author: “Zhipeng “zhipengmail@qq.com”
 * @Date: 2024-12-20 10:04:44
 * @LastEditors: “Zhipeng “zhipengmail@qq.com”
 * @LastEditTime: 2024-12-20 10:12:44
 * @FilePath: /django-react-website/frontend/src/components/common/ThemeSwitch.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
