import "@testing-library/jest-dom/vitest";

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
