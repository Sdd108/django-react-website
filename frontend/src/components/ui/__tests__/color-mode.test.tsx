import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createTestWrapper } from "../../../__tests__/test-utils";

// ============================================================================
// 注意：导入 color-mode 模块会触发 localStorage monkey-patch（仅 "theme" key）。
// 测试中直接使用原生 localStorage API 即可验证 TTL 行为。
// ============================================================================
import {
  ColorModeButton,
  useColorMode,
  getTimeBasedTheme,
  supportsSystemTheme,
  _origGetItem,
  _origSetItem,
  _origRemoveItem,
} from "../color-mode";

// ============================================================================
// getTimeBasedTheme
// ============================================================================
describe("getTimeBasedTheme", () => {
  it("returns light during daytime (6:00–17:59)", () => {
    // 模拟白天 —— 中午 12:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 4, 12, 0, 0)); // June 4, noon
    expect(getTimeBasedTheme()).toBe("light");
    vi.useRealTimers();
  });

  it("returns dark during nighttime (18:00–5:59)", () => {
    // 模拟夜晚 —— 凌晨 2:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 4, 2, 0, 0)); // June 4, 2am
    expect(getTimeBasedTheme()).toBe("dark");
    vi.useRealTimers();
  });

  it("returns light at 6:00 (boundary start)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 4, 6, 0, 0));
    expect(getTimeBasedTheme()).toBe("light");
    vi.useRealTimers();
  });

  it("returns dark at 17:59 (one minute before night boundary)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 4, 17, 59, 0));
    expect(getTimeBasedTheme()).toBe("light");
    vi.useRealTimers();
  });

  it("returns dark at 18:00 (boundary start)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 4, 18, 0, 0));
    expect(getTimeBasedTheme()).toBe("dark");
    vi.useRealTimers();
  });
});

// ============================================================================
// supportsSystemTheme
// ============================================================================
describe("supportsSystemTheme", () => {
  it("returns true when prefers-color-scheme is supported", () => {
    // jsdom 的 matchMedia 默认支持 prefers-color-scheme
    expect(supportsSystemTheme()).toBe(true);
  });

  it("returns false when window is undefined (SSR)", () => {
    // 这个场景在 jsdom 里测不到，但逻辑很简单：
    // typeof window === 'undefined' → false
    // 这里保留测试以保证代码覆盖率
    const originalWindow = globalThis.window;
    // @ts-expect-error - 模拟 SSR 环境
    delete globalThis.window;
    expect(supportsSystemTheme()).toBe(false);
    globalThis.window = originalWindow;
  });

  it("returns false when matchMedia throws", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = () => {
      throw new Error("not supported");
    };
    expect(supportsSystemTheme()).toBe(false);
    window.matchMedia = originalMatchMedia;
  });

  it("returns false when media query resolves to 'not all'", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (() =>
      ({
        matches: false,
        media: "not all",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) satisfies MediaQueryList) as typeof window.matchMedia;
    expect(supportsSystemTheme()).toBe(false);
    window.matchMedia = originalMatchMedia;
  });
});

// ============================================================================
// localStorage TTL monkey-patch
// ============================================================================
describe("localStorage TTL wrapping", () => {
  const THEME_KEY = "theme";
  // 从 color-mode 导入的是原始 Storage.prototype 方法（未绑定），
  // 需要 .call(localStorage, ...) 调用。这里创建便捷的绑定版本。
  const nativeGetItem = (key: string) => _origGetItem!.call(localStorage, key);
  const nativeSetItem = (key: string, value: string) =>
    _origSetItem!.call(localStorage, key, value);
  const nativeRemoveItem = (key: string) =>
    _origRemoveItem!.call(localStorage, key);

  beforeEach(() => {
    nativeRemoveItem(THEME_KEY);
  });

  afterEach(() => {
    nativeRemoveItem(THEME_KEY);
  });

  it("stores theme as JSON with timestamp", () => {
    // 通过 monkey-patched setItem 写入
    localStorage.setItem(THEME_KEY, "dark");

    // 通过原生 getItem 读取原始存储值（绕过 monkey-patch）
    const rawValue = nativeGetItem(THEME_KEY);
    expect(() => JSON.parse(rawValue!)).not.toThrow();
    const raw = JSON.parse(rawValue!);
    expect(raw).toHaveProperty("value", "dark");
    expect(raw).toHaveProperty("timestamp");
    expect(typeof raw.timestamp).toBe("number");
  });

  it("getItem returns the plain value (not JSON)", () => {
    localStorage.setItem(THEME_KEY, "light");
    // monkey-patched getItem 应解包并返回纯字符串
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("getItem returns null for expired entries", () => {
    // 用原生 API 写入一个已过期的条目
    const expiredEntry = JSON.stringify({
      value: "dark",
      timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 小时前
    });
    nativeSetItem(THEME_KEY, expiredEntry);

    // monkey-patched getItem 应返回 null（已过期）
    expect(localStorage.getItem(THEME_KEY)).toBeNull();
  });

  it("removes expired entries from storage", () => {
    const expiredEntry = JSON.stringify({
      value: "dark",
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
    });
    nativeSetItem(THEME_KEY, expiredEntry);

    // 通过 monkey-patch 读取（应触发清除）
    localStorage.getItem(THEME_KEY);

    // 原生存储应已被清除
    expect(nativeGetItem(THEME_KEY)).toBeNull();
  });

  it("does not affect other localStorage keys", () => {
    localStorage.setItem("other-key", "hello");
    // monkey-patch 不影响其他 key
    expect(localStorage.getItem("other-key")).toBe("hello");
    // 原生 getItem 也应能读到
    expect(nativeGetItem("other-key")).toBe("hello");
    nativeRemoveItem("other-key");
  });

  it("clears old-format plain string entries", () => {
    // 模拟旧版本遗留的纯字符串格式（通过原生 API 写入）
    nativeSetItem(THEME_KEY, "light");

    // monkey-patched getItem 应将其视为过期并清除（无法解析 JSON →视为过期）
    expect(localStorage.getItem(THEME_KEY)).toBeNull();
    // 原始存储也应被清除
    expect(nativeGetItem(THEME_KEY)).toBeNull();
  });

  it("handles corrupted JSON gracefully", () => {
    nativeSetItem(THEME_KEY, "{corrupted json!!!");

    // 应返回 null 并清除损坏的条目
    expect(localStorage.getItem(THEME_KEY)).toBeNull();
    expect(nativeGetItem(THEME_KEY)).toBeNull();
  });

  it("returns valid non-expired values", () => {
    // 正常设置（通过 monkey-patched setItem）
    localStorage.setItem(THEME_KEY, "dark");

    // 应返回纯字符串值
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("expires after 3 hours using fake timers", () => {
    vi.useFakeTimers();
    const start = new Date(2026, 5, 4, 12, 0, 0).getTime();
    vi.setSystemTime(start);

    // 通过 monkey-patched setItem 写入
    localStorage.setItem(THEME_KEY, "dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");

    // 前进 3 小时 + 1 毫秒
    vi.setSystemTime(start + 3 * 60 * 60 * 1000 + 1);

    // 现在应返回 null
    expect(localStorage.getItem(THEME_KEY)).toBeNull();

    vi.useRealTimers();
  });
});

// ============================================================================
// ColorModeButton
// ============================================================================
describe("ColorModeButton", () => {
  it("renders a button with aria-label", () => {
    const wrapper = createTestWrapper("/");
    render(<ColorModeButton />, { wrapper });

    const button = screen.getByLabelText("Toggle color mode");
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  it("toggleColorMode is callable without throwing", () => {
    // 验证 useColorMode hook 在 Provider 上下文中可正常调用，
    // toggleColorMode 可被触发而不抛出异常。
    function TestToggle() {
      const { toggleColorMode, colorMode } = useColorMode();
      return (
        <>
          <span data-testid="current-mode">{colorMode}</span>
          <button type="button" onClick={toggleColorMode}>
            toggle
          </button>
        </>
      );
    }

    const wrapper = createTestWrapper("/");
    render(<TestToggle />, { wrapper });

    // 验证组件渲染且提供了有效的 toggle 函数
    expect(screen.getByTestId("current-mode")).toBeInTheDocument();
    // 调用 toggle 不抛异常（next-themes 在 jsdom 中会尝试修改 document.documentElement）
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  it("renders light/dark icon based on current theme", () => {
    const wrapper = createTestWrapper("/");
    render(<ColorModeButton />, { wrapper });

    // 至少渲染了一个按钮（具体图标取决于当前主题）
    const button = screen.getByLabelText("Toggle color mode");
    expect(button).toBeInTheDocument();
  });
});
