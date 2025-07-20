import nemo.collections.asr as nemo_asr
import shutil
import tempfile
import os
from fastapi import UploadFile

# Loading Model
try:
    asr_model = nemo_asr.models.EncDecCTCModelBPE.restore_from(
        "app/ai-models/stt_th_fastconformer_ctc_large_nacc_data.nemo"
    )
    asr_model.eval() # More consistent result since neuron are active for evaluation mode
except Exception as e:
    print("Error occurred during loading AI model", e)


# Make temporary file and Transcribe audio file
async def transcribe_audio_file(file: UploadFile):

    try:
        with tempfile.NamedTemporaryFile("wb", delete=False, suffix=".wav") as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        try:
            output = asr_model.transcribe([temp_path])

        except Exception as e:
            print("Error while transcription sound", e)

    except Exception as e:
        print("Error while convert sound file", e)

    finally:
        os.remove(temp_path)

    return output[0].text
