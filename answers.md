**Technical Questions**

**1.	How much time did you spend on the engineering task?**

I spent around 12 hours on the engineering task, which included code review, refactoring for maintainability, and building a robust test suite covering UI components, custom hooks, and utilities with near-complete code coverage.

Estimated Time Spent

| **Area** | **Description** | **Estimated Time** |
|-----------|------------------|--------------------|
| Component analysis & refactoring | Reviewing each React + TypeScript component (e.g., ResizableDraggablePanel, MainWorkspace, UserProfile, etc.) and refactoring for clarity, accessibility, ESLint compliance and documentation | 5 hours |
| Unit testing setup and writing testcases | Writing comprehensive test cases using Vitest + React Testing Library for all components, hooks, and utils | 4 hours |
| Test debugging & mock adjustments | Fixing async behavior, mocking DOM APIs (ResizeObserver, localStorage, etc.), stabilizing tests. | 2 hours |
| React version 19, Replace webpack to vite, linting setup | Dependency updates, peer deps fixes, Code fixes (ReactDOM.render → createRoot, removal of React imports, etc.), Library compatibility checks (Ant Design, ag-grid, rc-*, etc.), lint/type fixups | 1 hours |

**2.	What would you add to your solution if you’d had more time?**

If I had more time, I would add the following steps:
- State Management

Right now, the state is managed at the component level using local state. To improve scalability and maintainability, I’d introduce a centralized store using Redux Toolkit or MobX. This would help manage shared states such as panel positions, user sessions, and asynchronous data (like fruits list or enrichment data) more efficiently across components.

- UI/UX Enhancement

I would enhance the user experience by adding smooth drag-and-drop animations and ensuring the application is mobile-friendly through responsive design. Additionally, I’d move all inline CSS into their respective SCSS files to improve readability, maintainability, and consistency.

- Mock Authentication → Real Auth Integration

The current mockLogin function simulates auth locally.
Next step would be:
Integrate with a real API using JWT or OAuth2.
Add route guards, refresh tokens, and logout flow.

- End-to-End (E2E) Tests

Currently, the project has good unit test coverage using React  Testing Library, but no end-to-end (E2E) testing. I would introduce Cypress to add E2E tests that simulate real user flows, such as:
   - Login and logout functionality
   - Drag-and-drop interactions
   - Adding and removing panels
   - State persistence across page reloads

- Type-Safety & Code Quality Enhancements

I would strengthen TypeScript strictness by enabling rules such as noImplicitAny, and replacing all implicit any types in props and hooks with well-defined interfaces or type definitions. Additionally, I’d integrate ts-eslint along with eslint-plugin-react-refresh to proactively detect hot-reload and concurrency-related issues during development.
To maintain consistent code quality, I’d also configure lint-staged and Husky for pre-commit linting

- Performance & Bundle Analysis

Integrate Vite Bundle Visualizer to monitor bundle size and identify large or unnecessary dependencies. Add React Profiler traces to measure performance improvements introduced by concurrent rendering in React 19.

**3.	What do you think is the most useful feature added to the latest version of JS/TS?**

**JavaScript — RegExp.escape()**

When dynamically building regex patterns, escaping characters was painful.
```bash
Ex. const unsafeInput = "hello.world";
const safePattern = new RegExp(RegExp.escape(unsafeInput));
console.log(safePattern); // /hello\.world/
```

**TypeScript — Satisfies Operator**

Introduced earlier but still one of the most impactful TypeScript features.
```bash
Ex. type User = { id: number; name: string };

const user = {
  id: 1,
  name: "Alice",
  extra: true, // no error
} satisfies User;
```

**JavaScript — Iterator Helpers**

New built-in iterator helpers let you process any iterable lazily, similar to how arrays work but without creating intermediate arrays.
```bash
Ex. // Using the new Iterator helper methods
const numbers = [1, 2, 3, 4, 5];

// Convert array into an iterator
const result = numbers
  .values()                  // Returns an iterator
  .filter(n => n % 2 === 1)  // Keep only odd numbers
  .map(n => n * n)           // Square them
  .take(2)                   // Take first two
  .toArray();                // Convert back to array

console.log(result); // [1, 9]
```
Why it’s useful?
- Works with any iterable, not just arrays
- Lazy evaluation – doesn’t create intermediate arrays
- Great for streaming data or large datasets

a. Include a code snippet that shows how you’ve used it.
```bash
export const panelList = [
  { key: "fruitbook", title: "Fruit Book", content: <FruitBookPanel /> },
  { key: "fruitview", title: "Fruit View", content: <FruitViewPanel /> },
  { key: "about", title: "About", content: <AboutPanel /> },
] satisfies PanelConfig[];
```

**4.	How would you track down a performance issue in production?**

I would begin by gathering observability data from application monitoring dashboards such as Datadog to identify which routes, pages, or APIs are performing slowly. Once the affected feature is identified, I would reproduce the issue in a controlled environment. Using Chrome DevTools’ Performance tab and the React Profiler, I would analyze component render timings to check for unnecessary re-renders or heavy computations occurring during render.
Next, I’d benchmark the application using Lighthouse or the Web Vitals CLI to capture performance metrics before optimization. After confirming the bottleneck, I’d apply targeted and measurable optimizations, such as:
- Memoizing components with React.memo, useMemo, or useCallback
- Implementing code-splitting with React.lazy to defer non-critical components
- Caching data efficiently using SWR or React Query
- Reducing bundle size through Vite bundle analyzer and dynamic imports
Finally, I would validate the improvements by comparing before-and-after results in Datadog or Lighthouse reports and automating performance checks in CI using Lighthouse CI and Web Vitals thresholds.

a.	Have you ever had to do this?

Yes, in my last project, we faced slow page routing and long load times in production.
Using Datadog dashboards, we identified that the largest bundle was being loaded upfront, and lazy loading wasn’t properly implemented. After implementing dynamic imports and React.lazy(), we significantly improved initial load time and reduced bundle size.
We also noticed a few unnecessary re-renders, which we fixed using React.memo and proper dependency management in hooks. The performance score improved by over 30%.




