from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql+psycopg://postgres:0000@localhost:5432/pogeun"

engine = create_engine(DATABASE_URL, echo=True)

def test_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        return result.scalar()