from fastapi import FastAPI
from . import models
from .database import engine
from .routes import auth, feedback, users
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://feedback-frontend-skur.onrender.com"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(feedback.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Feedback System!"}
