from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "sqlite:///./devolo.db"

    JWT_SECRET: str = "CHANGE_ME_DEV_ONLY"
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 20
    REFRESH_TOKEN_DAYS: int = 7
    REFRESH_TOKEN_DAYS_REMEMBER: int = 30

settings = Settings()
