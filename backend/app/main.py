from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from app.api.clothing_item import router as clothing_item_router
from app.api.weather import router as weather_router

from app.core.database import get_database_label, test_connection

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

app.include_router(clothing_item_router)
app.include_router(weather_router)
