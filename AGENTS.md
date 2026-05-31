# Repository Guidelines

## Project Structure & Module Organization

This repository contains a personal website split into three top-level projects:

- `backend/`: Django REST Framework API. Django project settings live in `backend/backend/`; apps include `api/`, `articles/`, and `contact_message/`. Tests are colocated as `tests.py` in each app.
- `frontend/`: React + TypeScript + Vite app. Source lives in `frontend/src/`, with pages in `src/pages/`, shared components in `src/components/`, UI wrappers in `src/components/ui/`, and tests in `src/**/__tests__/`.
- `scraper/`: Scrapy article scraper. Active Scrapy package files are under `scraper/scraper/`; older scaffold files also exist under `scraper/src/`.

## Build, Test, and Development Commands

Backend commands:

```bash
cd backend
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
uv run pytest -v
```

Frontend commands:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm test
```

Scraper commands:

```bash
cd scraper
uv sync
uv run scrapy crawl article_spider
```

The Vite dev server proxies `/api` to `http://localhost:8000`, so run the backend before testing frontend API flows.

## Coding Style & Naming Conventions

Use 4-space indentation for Python and 2-space indentation for TypeScript/TSX. Python modules and Django apps use `snake_case`; React components and page files use `PascalCase` such as `ArticlesPage.tsx`. Prefer typed React props and interfaces near the component that owns them. Use the `@/*` alias for frontend imports from `src/`.

Run Python formatting with `uv run ruff format .` when Ruff is available. Run `npm run lint` and `npm run build` before frontend changes are considered complete.

## Testing Guidelines

Backend tests use Django test tools, DRF `APITestCase`, and pytest configuration in `backend/pytest.ini`. Keep app tests in each app’s `tests.py`, and name tests `test_<behavior>`.

Frontend tests use Vitest, jsdom, and Testing Library. Place tests in `src/**/__tests__/` and name files `*.test.tsx`. Use `frontend/src/__tests__/test-utils.tsx` for Chakra, React Query, and router providers.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style subjects, for example `docs: add code formatting guideline`, `style: format codebase`, `chore: remove dead code`, and `fix: secure backend`. Follow that pattern: `<type>: <imperative summary>`.

Pull requests should include a brief summary, commands run, linked issues if applicable, and screenshots for visible frontend changes. Note any migrations, environment variables, or API contract changes.

## Security & Configuration Tips

Do not commit real secrets or production databases. Configure Django secrets, debug mode, allowed hosts, and CORS through environment-specific settings before deployment. Treat `CORS_ALLOW_ALL_ORIGINS` as development-only.
