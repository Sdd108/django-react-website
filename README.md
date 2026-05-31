# sruta.cn

A personal website built with **Django REST Framework** (backend), **React + TypeScript + Vite** (frontend), and **Scrapy** (article scraper).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Django 6, Django REST Framework, SQLite |
| Frontend | React 19, TypeScript, Vite 7, Chakra UI v3 |
| State | TanStack React Query, Zustand |
| Routing | React Router v7 |
| Scraper | Scrapy |

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+

### Backend

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers django-filter

# Run migrations
python manage.py migrate

# Start dev server (http://localhost:8000)
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build
```

### Scraper

```bash
cd scraper
scrapy crawl article_spider
```

## Project Structure

```
├── backend/              # Django REST API
│   ├── api/              # Article REST endpoints
│   ├── articles/         # Article model
│   ├── contact_message/  # Contact form submissions
│   └── backend/          # Django project settings
├── frontend/         # React + Vite frontend
│   └── src/
│       ├── components/   # NavBar, UI primitives
│       └── pages/        # Home, Articles, About, Contact
├── scraper/              # Scrapy article spider
└── CLAUDE.md             # AI-assisted development guide
```

## Features

- **Articles** — browse and read technical articles with pagination
- **About** — personal profile with skills and experience
- **Contact** — form with validation that submits to the backend
- **Dark mode** — toggle between light and dark themes
- **Responsive** — works on desktop and mobile

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles/` | List articles (paginated) |
| GET | `/api/articles/:id/` | Article detail |
| POST | `/api/contact/` | Submit contact message |
| GET | `/admin/` | Django admin |

## License

MIT
