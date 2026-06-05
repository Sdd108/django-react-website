# Repository Guidelines

## Project Structure & Module Organization

This repository contains a personal website for `sruta.cn` split into three top-level projects:

- `backend/`: Django REST Framework API using SQLite for local development. Django settings live in `backend/backend/`; apps include `api/`, `articles/`, and `contact_message/`.
- `frontend/`: React 19 + TypeScript + Vite app. Source lives in `frontend/src/`, with pages in `src/pages/`, shared components in `src/components/`, Chakra UI wrappers in `src/components/ui/`, and tests in `src/**/__tests__/`.
- `scraper/`: Scrapy article scraper. Current Scrapy package files are under `scraper/scraper/`; older scaffold files remain under `scraper/src/`.

## Build, Test, and Development Commands

Backend commands:

```bash
cd backend
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
uv run python manage.py test
uv run python manage.py test articles
uv run pytest -v
uv run python manage.py create_test_articles
```

Frontend commands:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run preview
npm test
```

Scraper commands:

```bash
cd scraper
uv sync
uv run scrapy crawl article_spider
```

The Vite dev server proxies `/api` to `http://localhost:8000`, so run the backend before testing frontend API flows. If the scraper cannot start, check `scraper/scrapy.cfg`; it currently references `config.settings`, while the visible settings module is `scraper.settings`.

## Architecture Notes

Backend:

- `backend/backend/urls.py` exposes `/admin/`, `/api/`, `/api/contact/`, and a JSON root health response at `/`.
- `api.ArticleViewSet` is wired through a DRF router at `/api/articles/` and supports list, detail, create, update, and delete.
- Article responses are paginated with `results`, `count`, `next`, and `previous`; default page size is 10 and `page_size` is capped at 100.
- Article filtering supports exact `author` and `title`; search covers `title`, `content`, and `author`.
- `articles.Article` owns the article model fields: `title`, `content`, `author`, `published_date`, optional `source_url`, `created_at`, and `updated_at`.
- `api.serializers.ArticleSerializer` adds `last_updated` as a read-only alias for `updated_at`.
- `contact_message` exposes a single POST flow at `/api/contact/` and validates through `MessageSerializer`.
- DRF defaults use `AllowAny`, `PageNumberPagination`, `DjangoFilterBackend`, and `SearchFilter`. Timezone is `Asia/Shanghai`.

Frontend:

- `src/main.tsx` wraps the app in `QueryClientProvider`, Chakra/ColorMode `Provider`, `RouterProvider`, and `Toaster`.
- Routes are defined in `src/routes.tsx` under `Layout`: home, articles list, article create, article edit, article detail, about, contact, and error page.
- Server state uses TanStack React Query. Styling uses Chakra UI v3 plus local UI wrappers.
- Markdown article content is rendered through `ArticleMarkdown` with `react-markdown` and `remark-gfm`.
- Use the `@/*` alias for imports from `src`; it is configured in both `vite.config.ts` and `tsconfig.app.json`.
- Vite/Vitest use jsdom and `src/test-setup.ts`; shared test providers live in `src/__tests__/test-utils.tsx`.

Scraper:

- `scraper/scraper/spiders/article_spider.py` is a placeholder spider targeting `https://example.com/articles`; replace selectors and URLs before real crawling.
- `scraper/scraper/pipelines.py` initializes Django and saves scraped items to the `Article` model.
- Keep scraper item fields aligned with the backend model and serializer fields.

## Coding Style & Naming Conventions

Use 4-space indentation for Python and 2-space indentation for TypeScript/TSX. Python modules and Django apps use `snake_case`; React components and page files use `PascalCase`, such as `ArticlesPage.tsx`.

Prefer typed React props and interfaces near the component that owns them. Follow the existing Chakra UI wrapper pattern in `src/components/ui/` instead of importing one-off provider logic into pages.

Run formatters after code changes:

```bash
cd backend
uv run ruff format .

cd frontend
npx prettier --write "src/**/*.{ts,tsx,css}"
```

Run `npm run lint` and `npm run build` before frontend changes are considered complete.

## Testing Guidelines

Backend tests use Django test tools, DRF `APITestCase`, and pytest configuration in `backend/pytest.ini`. Keep app tests in each app’s `tests.py`, and name tests `test_<behavior>`.

Frontend tests use Vitest, jsdom, and Testing Library. Place tests in `src/**/__tests__/` and name files `*.test.tsx`. Use `frontend/src/__tests__/test-utils.tsx` for Chakra, React Query, and router providers.

Always run both backend and frontend suites after changes touching shared interfaces, serializers, routes, API contracts, or article/contact workflows.

When asked to write or expand tests, act autonomously: add focused pytest and Vitest coverage for the touched behavior, run the relevant suite after each batch, debug failures, and report any meaningful uncovered edge cases.

## Common Pitfalls

- New Django packages and apps need `__init__.py` files.
- DRF viewsets that rely on filtering need explicit `filterset_fields` or `filterset_class`.
- `articles/new` must stay before `articles/:id` in `src/routes.tsx` so the dynamic route does not capture the create page.
- The backend stores Markdown article content as source text; rendering happens in the frontend.
- `CORS_ALLOW_ALL_ORIGINS = True` is development-only. Configure secrets, debug mode, allowed hosts, and CORS explicitly before deployment.
- Do not commit real secrets, local production databases, generated caches, build output, or scraper logs.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style subjects, for example `docs: add code formatting guideline`, `style: format codebase`, `chore: remove dead code`, and `fix: secure backend`. Follow that pattern: `<type>: <imperative summary>`.

Pull requests should include a brief summary, commands run, linked issues if applicable, and screenshots for visible frontend changes. Note any migrations, environment variables, or API contract changes.
