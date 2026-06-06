/* eslint-disable react-refresh/only-export-components */
"use client";

import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

// ============================================================================
// 带 3 小时 TTL 的自定义 localStorage 存储
//
// next-themes v0.4.6 没有 storage prop，因此通过拦截原生 localStorage
// 的 getItem / setItem 实现透明的时间戳包装。next-themes 内部读写
// localStorage 时会自动经过此层，对组件完全透明。
//
// 行为：
//   - setItem 写入 { value, timestamp } JSON
//   - getItem 检查 TTL：过期则返回 null（next-themes 回退到 defaultTheme）
//   - 旧格式（纯字符串）视为过期并清除
//   - 只拦截 "theme" 这个 key，其他 key 不受影响
// ============================================================================

const THEME_KEY = "theme";
const THEME_TTL_MS = 3 * 60 * 60 * 1000; // 3 小时

// 捕获原始 localStorage 方法引用（导出供测试访问原生存储）
const PatchedStorageProto =
  typeof window !== "undefined" && window.Storage
    ? window.Storage.prototype
    : typeof window !== "undefined"
      ? Object.getPrototypeOf(localStorage)
      : null;
const fallbackStorage = new Map<string, string>();
const nativeGetItem =
  typeof window !== "undefined" && typeof localStorage.getItem === "function"
    ? localStorage.getItem.bind(localStorage)
    : (key: string) => fallbackStorage.get(key) ?? null;
const nativeSetItem =
  typeof window !== "undefined" && typeof localStorage.setItem === "function"
    ? localStorage.setItem.bind(localStorage)
    : (key: string, value: string) => {
        fallbackStorage.set(key, value);
      };
const nativeRemoveItem =
  typeof window !== "undefined" && typeof localStorage.removeItem === "function"
    ? localStorage.removeItem.bind(localStorage)
    : (key: string) => {
        fallbackStorage.delete(key);
      };
const _origGetItem = typeof window !== "undefined" ? nativeGetItem : null;
const _origSetItem = typeof window !== "undefined" ? nativeSetItem : null;
const _origRemoveItem = typeof window !== "undefined" ? nativeRemoveItem : null;

// 导出原生引用，测试中可用于绕过 monkey-patch 直接读写原始存储
export { _origGetItem, _origSetItem, _origRemoveItem };

if (
  typeof window !== "undefined" &&
  _origGetItem &&
  _origSetItem &&
  _origRemoveItem
) {
  const patchedGetItem = function (key: string): string | null {
    if (key !== THEME_KEY) return _origGetItem(key);
    const raw = _origGetItem(key);
    if (!raw) return null;
    try {
      const { value, timestamp }: { value: string; timestamp: number } =
        JSON.parse(raw);
      if (Date.now() - timestamp > THEME_TTL_MS) {
        // 超过 3 小时，清除过期记录 → next-themes 将使用 defaultTheme
        _origRemoveItem(THEME_KEY);
        return null;
      }
      return value;
    } catch {
      // 旧格式（纯字符串），无法验证时间戳，视为过期并清除
      _origRemoveItem(THEME_KEY);
      return null;
    }
  };

  const patchedSetItem = function (key: string, value: string): void {
    if (key !== THEME_KEY) return _origSetItem(key, value);
    _origSetItem(key, JSON.stringify({ value, timestamp: Date.now() }));
  };

  const patchedRemoveItem = function (key: string): void {
    _origRemoveItem(key);
  };

  if (PatchedStorageProto) {
    PatchedStorageProto.getItem = patchedGetItem;
    PatchedStorageProto.setItem = patchedSetItem;
    PatchedStorageProto.removeItem = patchedRemoveItem;
  }

  try {
    Object.defineProperty(localStorage, "getItem", {
      value: patchedGetItem,
      configurable: true,
    });
    Object.defineProperty(localStorage, "setItem", {
      value: patchedSetItem,
      configurable: true,
    });
    Object.defineProperty(localStorage, "removeItem", {
      value: patchedRemoveItem,
      configurable: true,
    });
  } catch {
    // Some browser implementations reject direct localStorage property defines.
  }
}

// ============================================================================
// 系统主题检测 & 当地时间回退
// 当浏览器不支持 prefers-color-scheme 时，按当地时间判断：
//   6:00–17:59 → light（白天）
//  18:00–5:59  → dark（夜晚）
// ============================================================================

/** 按当地时间判断当前应使用的主题（导出供测试） */
export function getTimeBasedTheme(): "light" | "dark" {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

/** 检测浏览器是否支持 prefers-color-scheme 媒体查询（导出供测试） */
export function supportsSystemTheme(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    // 不支持的媒体查询会返回 "not all"
    return mql.media !== "not all" && mql.media !== "invalid";
  } catch {
    return false;
  }
}

// ============================================================================
// 导出组件和 hooks
// ============================================================================

export type ColorModeProviderProps = ThemeProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
  const canUseSystem = supportsSystemTheme();

  return (
    // 默认跟随系统主题；浏览器不支持时回退到当地时间。
    // 用户手动切换后持久化到 localStorage，3 小时后自动过期。
    // 通过 ...props 允许外部覆盖 enableSystem / defaultTheme 等参数。
    <ThemeProvider
      attribute="class"
      enableSystem={canUseSystem}
      defaultTheme={canUseSystem ? "system" : getTimeBasedTheme()}
      disableTransitionOnChange
      {...props}
    />
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, theme, systemTheme, forcedTheme } =
    useTheme();

  // 系统不支持色彩主题时，用当地时间作为回退的"系统"参考值，
  // 确保 toggle 能正确判断何时回到跟随系统模式。
  const effectiveSystem = supportsSystemTheme()
    ? (systemTheme as "light" | "dark" | undefined)
    : getTimeBasedTheme();

  // forcedTheme 优先级高于用户选择，用于未来需要锁定主题的页面。
  const colorMode = forcedTheme || resolvedTheme;

  const toggleColorMode = () => {
    if (theme === "system") {
      // 当前跟随系统 → 显式切换到与当前外观相反的主题
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      // 当前为手动设置 → 切换到相反主题，
      // 如果相反主题恰好与系统一致则回到跟随系统模式
      const opposite = resolvedTheme === "dark" ? "light" : "dark";
      if (opposite === effectiveSystem) {
        setTheme("system");
      } else {
        setTheme(opposite);
      }
    }
  };

  return {
    colorMode: colorMode as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  // 根据当前主题返回不同值，方便组件选择颜色或图标。
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  // 深色模式显示月亮，浅色模式显示太阳，和按钮行为相互对应。
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode();
  return (
    // ClientOnly 避免服务端/测试初始主题未知时产生图标闪烁。
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      // 用局部 class 强制子树按浅色主题渲染，适合嵌入固定主题片段。
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      // 用局部 class 强制子树按深色主题渲染，避免受全局主题切换影响。
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  },
);
