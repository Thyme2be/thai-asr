from fastapi import APIRouter, File, UploadFile 
from app.services.file_transcriber import transcribe_audio_file

router = APIRouter()

@router.post('/upload')
def transcribe_file(file: UploadFile = File(...)):
    if not file:
        return "FILE NOT FOUND"
    transcribed = transcribe_audio_file(file)
    return transcribed