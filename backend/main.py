from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
)
# Модель для фильмов (как DRF Serializer)
class Movie(BaseModel):
    id: int
    title: str
    year: int
    rating: float

# Заглушка базы данных
fake_db = [
    {"id": 1, "title": "Крестный отец", "year": 1972, "rating": 9.2},
    {"id": 2, "title": "Интерстеллар", "year": 2014, "rating": 8.6}
]

# API Endpoints (как DRF ViewSets)
@app.get("/api/movies/", response_model=List[Movie])
def get_movies():
    return fake_db

@app.post("/api/movies/", response_model=Movie)
def add_movie(movie: Movie):
    fake_db.append(movie.dict())
    return movie