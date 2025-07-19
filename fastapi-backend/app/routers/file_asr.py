from fastapi import APIRouter, File, UploadFile 
from app.services.file_transcriber import transcribe_audio_file

router = APIRouter()

@router.post('/upload')
async def transcribe_file(file: UploadFile = File(...)):
    text = await transcribe_audio_file(file)
    return {"transcribe": text}