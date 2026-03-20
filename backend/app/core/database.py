import os

from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DEFAULT_DATABASE_URL = "postgresql+psycopg://postgres:0000@localhost:5432/pogeun"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)
SQL_ECHO = os.getenv("SQL_ECHO", "false").lower() == "true"


class Base(DeclarativeBase):
    pass


engine = create_engine(DATABASE_URL, echo=SQL_ECHO)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def test_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        return result.scalar()


def get_database_label():
    url = make_url(DATABASE_URL)
    return f"{url.drivername}://{url.username}@{url.host}:{url.port}/{url.database}"
