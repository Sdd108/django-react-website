# Scrapy 主配置文件，控制爬虫模块、请求节奏、缓存、日志和重试策略。
BOT_NAME = 'article_scraper'

# 指定 Scrapy 查找 spider 的 Python 包路径。
SPIDER_MODULES = ['scraper.spiders']
NEWSPIDER_MODULE = 'scraper.spiders'

# 使用浏览器风格 User-Agent，减少目标站点误判为异常请求的概率。
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

# 遵守 robots.txt，避免抓取站点明确禁止访问的路径。
ROBOTSTXT_OBEY = True

# 全局并发请求上限，防止本地爬虫对目标站点造成过大压力。
CONCURRENT_REQUESTS = 16

# 同一站点请求间隔 3 秒，并启用随机化，模拟更温和的访问节奏。
DOWNLOAD_DELAY = 3
RANDOMIZE_DOWNLOAD_DELAY = True

# pipeline 负责把 spider 产出的 item 写入 Django 数据库。
ITEM_PIPELINES = {
    'scraper.pipelines.ScraperPipeline': 300,
}

# HTTP 缓存可减少重复调试时对目标站点的请求次数。
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86400
HTTPCACHE_DIR = 'httpcache'
HTTPCACHE_IGNORE_HTTP_CODES = [503, 504, 505, 500, 400, 401, 403, 404, 408]

# 将爬虫日志写入文件，便于长时间运行后回看错误和抓取数量。
LOG_LEVEL = 'INFO'
LOG_FILE = 'scraper.log'

# 针对临时服务端错误、限流和网络超时启用有限重试。
RETRY_ENABLED = True
RETRY_TIMES = 3
RETRY_HTTP_CODES = [500, 502, 503, 504, 522, 524, 408, 429]

# 单个请求最大等待时间，防止目标站点卡住时无限等待。
DOWNLOAD_TIMEOUT = 180

# 导出数据时统一使用 UTF-8，避免中文或特殊字符乱码。
FEED_EXPORT_ENCODING = 'utf-8'

# 限制链接跟进深度，避免爬虫跑出文章列表范围。
DEPTH_LIMIT = 2

# 默认请求头声明可接受 HTML/XML 内容和英文响应。
DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en',
}
