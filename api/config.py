from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://bookinguser:changeme@postgres:5432/bookingdb"
    DATABASE_URL_SYNC: str = "postgresql://bookinguser:changeme@postgres:5432/bookingdb"
    SECRET_KEY: str = "changeme_min_32_chars_random_string_here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    BOT_TOKEN: str = ""
    WEBHOOK_URL: str = ""
    WEBHOOK_SECRET: str = ""
    API_URL: str = "http://localhost:8000"
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"
    CORS_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
