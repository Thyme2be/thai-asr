from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import file_asr

app = FastAPI(title="Thai-ASR backend")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(file_asr.router, prefix='/api/file-asr', tags=['File ASR'])