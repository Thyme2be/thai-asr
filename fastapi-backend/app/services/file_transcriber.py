import pprint
import shutil
import tempfile
import os
from fastapi import UploadFile
import riva.client


def formattedTime(seconds):
    hrs = seconds // 3600
    mins = (seconds % 3600) // 60
    secs = seconds % 60
    return f"{hrs:02}:{mins:02}:{secs:02}"


def run_inference(audio_file, server="localhost:50051"):
    with open(audio_file, "rb") as fh:
        data = fh.read()

    auth = riva.client.Auth(uri=server)
    client = riva.client.ASRService(auth)
    config = riva.client.RecognitionConfig(
        language_code="th-TH",
        max_alternatives=1,
        enable_automatic_punctuation=False,
    )

    response = client.offline_recognize(data, config)
    return response


def transcribe_audio_file(file: UploadFile):

    try:

        # Make temporary file path since .read_audio() since Riva inference input required
        with tempfile.NamedTemporaryFile("wb", delete=False, suffix=".wav") as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        try:

            all_transcribes = run_inference(temp_path)

            transcribed_output = [
                f"{formattedTime(trans.alternatives[0].words[0].start_time // 1000)}: {trans.alternatives[0].words[0].word}"
                for trans in all_transcribes.results
            ]

            output = {"text": "\n".join(transcribed_output)}
            # pprint.pp(output)
            return output

        except Exception as e:
            print("TRANSCRIBE WITH RIVA SERVER ERROR:", e)

    except Exception as e:
        print("Error while convert sound file", e)

    finally:
        os.remove(temp_path)
