# Scrapy settings
BOT_NAME = 'article_scraper'

SPIDER_MODULES = ['scraper.spiders']
NEWSPIDER_MODULE = 'scraper.spiders'

# Crawl responsibly by identifying yourself (and your website) on the user-agent
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# Configure maximum concurrent requests performing at the same time
CONCURRENT_REQUESTS = 16

# Configure a delay for requests for the same website (default: 0)
DOWNLOAD_DELAY = 3  # 3 seconds of delay
RANDOMIZE_DOWNLOAD_DELAY = True

# Configure item pipelines
ITEM_PIPELINES = {
    'scraper.pipelines.ScraperPipeline': 300,
}

# Enable and configure HTTP caching (disabled by default)
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86400  # 24 hours
HTTPCACHE_DIR = 'httpcache'
HTTPCACHE_IGNORE_HTTP_CODES = [503, 504, 505, 500, 400, 401, 403, 404, 408]

# Configure logging
LOG_LEVEL = 'INFO'
LOG_FILE = 'scraper.log'

# Configure retries
RETRY_ENABLED = True
RETRY_TIMES = 3
RETRY_HTTP_CODES = [500, 502, 503, 504, 522, 524, 408, 429]

# Configure timeouts
DOWNLOAD_TIMEOUT = 180  # 3 minutes

# Configure encoding
FEED_EXPORT_ENCODING = 'utf-8'

# Configure maximum depth
DEPTH_LIMIT = 2

# Configure request headers
DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en',
} 