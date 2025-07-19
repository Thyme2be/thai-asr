# **Prerequisites**

## ASR model can accepts input:

    - `.wav` file type
    - 16000 Hz Mono-channel

# **Possiblity Error**

## **`No module named 'torch.nn.attention'`**

Error occured when Pytorch version when installing with **Nemo Framework** document is version `pytorch=2.2.0`

> Upgrade to `pytorch=2.7.1` to resolve the error

# **Bug Faced**

## If `outer function` is `async` and `await` for `inner function`, `inner function` have to use `async` eventhough there is no `await` use in `inner function`

Happend in `fastapi-backend/services/file_transcriber.py` and `fastapi-backend/routers/fast_asr.py` - hat AI Suggest:

```{toggle}
import nemo.collections.asr as nemo_asr
import shutil
import tempfile
import os
from fastapi import UploadFile

try:
    asr_model = nemo_asr.models.EncDecCTCModelBPE.restore_from(
        "app/ai-models/stt_th_fastconformer_ctc_large_nacc_data.nemo"
    )
except Exception as e:
    print("Error occurred during loading AI model", e)


async def transcribe_audio_file(file: UploadFile):
    temp_path = None
    transcribed_text = ""

    try:
        with tempfile.NamedTemporaryFile("wb", delete=False, suffix=".wav") as tmp:
            await file.seek(0)
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        try:
            output = asr_model.transcribe([temp_path])

            if output and len(output) > 0:
                transcribed_text = output[0]
            else:
                print("Transcription returned empty output.")

        except Exception as e:
            print(f"Error while transcription sound: {e}")

    except Exception as e:
        print(f"Error during file processing (creating temp file or copying): {e}")

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError as e:
                print(f"Error removing temporary file {temp_path}: {e}")
        if file.file:
            await file.close()

    print(transcribed_text)
    return transcribed_text
```

- What actually resolve by `async`:

```{toggle}
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
```
