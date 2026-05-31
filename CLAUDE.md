# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal website (sruta.cn) built with **Django REST Framework** backend, **React + TypeScript + Vite** frontend, and a **Scrapy** scraper for crawling articles.

## Commands

### Backend (`backend/`)

```bash
cd backend
python manage.py runserver           # Start dev server (default :8000)
python manage.py test                # Run all tests
python manage.py test articles       # Run article tests only
python manage.py create_test_articles # Seed DB with 55 test articles
```

### Frontend (`frontend/`)

```bash
cd frontend
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + production build → dist/
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

### Scraper (`scraper/`)

```bash
cd scraper
scrapy crawl article_spider
```

## Testing

- Backend: `cd backend && python manage.py test` (or `cd backend && source venv/bin/activate && pytest -v`)
- Frontend: `cd frontend && npm test`
- Always run both suites after changes touching shared interfaces, serializers, or API contracts.

## Architecture

### Backend — Django + DRF (SQLite)

Three Django apps, all registered in `INSTALLED_APPS`:

| App | Purpose | Key detail |
|-----|---------|------------|
| `api/` | Primary REST API | `ArticleViewSet(ModelViewSet)` with DRF router at `/api/articles/`, pagination (10/page), django-filter + search |
| `articles/` | Article model + read-only viewset | `Article` model: title, content, author, published_date, source_url. Also has its own `ArticleViewSet(ReadOnlyModelViewSet)` |
| `contact_message/` | Contact form submissions | `Message` model (name, email, phone, content). Single POST endpoint at `/api/contact/` |

- **Note:** Both `api/` and `articles/` define `ArticleViewSet` and share `api.serializers.ArticleSerializer`. The `api/` one is wired into the URL router; `articles/` appears to duplicate/overlap.
- CORS is wide open (`CORS_ALLOW_ALL_ORIGINS = True`) — dev only.
- DRF defaults: `PageNumberPagination`, `AllowAny` permissions, `DjangoFilterBackend` + `SearchFilter`.
- Timezone: `Asia/Shanghai`.

### Frontend (`frontend/`) — React 19 + Vite + Chakra UI v3

```
src/
├── main.tsx              # Entry point: QueryClientProvider + ChakraProvider + RouterProvider + Toaster
├── App.tsx               # Unused (renders <Test /> only, not wired in)
├── routes.tsx            # createBrowserRouter with layout routes
├── components/
│   ├── NavBar.tsx        # Sticky nav with links + ColorModeButton
│   ├── Test.tsx          # Placeholder component (just renders ColorModeButton)
│   └── ui/               # Chakra UI primitives wrappers
│       ├── provider.tsx   # ChakraProvider + ColorModeProvider
│       ├── color-mode.tsx # Dark/light toggle via next-themes
│       ├── toaster.tsx    # Toast notification setup
│       └── tooltip.tsx    # Tooltip component
└── pages/
    ├── Layout.tsx         # Flex layout (nav / main / footer), renders <Outlet />
    ├── HomePage.tsx       # Landing page with hero + feature cards
    ├── ArticlesPage.tsx   # Article list with paginated API fetching
    ├── ArticleDetailPage.tsx # Single article detail view
    ├── AboutPage.tsx      # Personal profile with skills and experience
    ├── ContactPage.tsx    # Contact form with validation and toasts
    └── ErrorPage.tsx      # Error boundary page with NavBar
```

**Key dependencies and patterns:**
- **Chakra UI v3** (`@chakra-ui/react`) for components and styling
- **next-themes** for dark/light mode (class-based, persisted)
- **React Router v7** (`createBrowserRouter`) with layout routes
- **TanStack React Query** for server-state (fetching, caching) — requires `QueryClientProvider`
- **Zustand** for client-side state management
- **Ant Design v6** icons (`@ant-design/icons`) alongside react-icons
- Path alias: `@/*` → `./src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`)
- Vite with `vite-tsconfig-paths` plugin for alias resolution
- Vite dev server proxies `/api` → `http://localhost:8000`

### Scraper (`scraper/`)

Standard Scrapy project. `ArticleSpider` scrapes article title/content/author/date from example.com (placeholder URLs/selectors — needs real targets). Has a Django integration pipeline (`django_pipeline.py`) for saving scraped items directly to the Django database.

## Common Pitfalls

- New Django packages require `__init__.py` files.
- DRF viewsets need `filterset_class` or `filterset_fields` declared before testing.
- Vitest must be installed in `frontend/` with `environment: 'jsdom'` and path aliases matching Vite config.
