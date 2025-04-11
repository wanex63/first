from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt

router = APIRouter()

SECRET_KEY = "ваш_секретный_ключ"
ALGORITHM = "HS256"

class User(BaseModel):
    username: str
    password: str

fake_users_db = {}

@router.post("/register")
def register(user: User):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    fake_users_db[user.username] = user
    return {"message": "User created"}

@router.post("/login")
def login(user: User):
    if user.username not in fake_users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = jwt.encode(
        {"sub": user.username, "exp": datetime.utcnow() + timedelta(minutes=30)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": access_token}