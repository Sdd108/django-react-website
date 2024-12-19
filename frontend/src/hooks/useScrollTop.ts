/*
 * @Author: “Zhipeng “zhipengmail@qq.com”
 * @Date: 2024-12-19 21:44:37
 * @LastEditors: “Zhipeng “zhipengmail@qq.com”
 * @LastEditTime: 2024-12-19 21:44:39
 * @FilePath: /django-react-website/frontend/src/hooks/useScrollTop.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
};