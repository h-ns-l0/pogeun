from fastapi import FastAPI, HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import get_database_label, test_connection

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/health/db")
def health_db():
    try:
        version = test_connection()
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "error",
                "database": get_database_label(),
                "reason": str(exc.__class__.__name__),
            },
        ) from exc

    return {
        "status": "ok",
        "database": get_database_label(),
        "version": version,
    }
