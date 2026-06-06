import "@testing-library/jest-dom/vitest";

if (
  typeof window.localStorage?.getItem !== "function" ||
  typeof window.localStorage?.setItem !== "function" ||
  typeof window.localStorage?.removeItem !== "function"
) {
  const storage = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
    },
  });
}

// jsdom 没有实现 matchMedia；Chakra/颜色模式组件依赖它，因此在测试环境中提供轻量 mock。
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
