import nemo.collections.asr as nemo_asr
import shutil
import tempfile
import os
from fastapi import UploadFile
from silero_vad import load_silero_vad, read_audio, get_speech_timestamps

# Higher BATCH_SIZE will consume more computer resource, but faster process
BATCH_SIZE = 32


def formattedTime(seconds):
    hrs = seconds // 3600
    mins = (seconds % 3600) // 60
    secs = seconds % 60
    return f"{hrs:02}:{mins:02}:{secs:02}"


# Loading Model
try:

    # Voice Acitivity Detection (VAD) model
    vad_model = load_silero_vad()
    SAMPLING_RATE = (
        16_000  # Silero VAD only supports 8000 Hz and 16,000 Hz sampling rates
    )

    # Transcribe model
    asr_model = nemo_asr.models.EncDecCTCModelBPE.restore_from(
        "app/ai-models/stt_th_fastconformer_ctc_large_nacc_data.nemo"
    )

    asr_model.eval()  # More consistent result since neuron are active for evaluation mode

    # Config for .transcribe_generator()
    config = asr_model.get_transcribe_config()
    config.batch_size = (
        BATCH_SIZE  # Higher will process faster, but consume more computer resource
    )

    # Config ASR Transducer Decoding
    decoding_cfg = asr_model.cfg.decoding
    decoding_cfg.strategy = "greedy_batch"
    asr_model.change_decoding_strategy(
        decoding_cfg
    )  # asr_model.change_decoding_strategy(decoding_cfg={"strategy": "greedy_batch"})

except Exception as e:
    print("Error occurred during loading AI model", e)


# Async if need
async def transcribe_audio_file(file: UploadFile):

    try:
        
        # Make temporary file path since .read_audio() from Silero VAD input required
        with tempfile.NamedTemporaryFile("wb", delete=False, suffix=".wav") as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        try:

            # wav contain <class 'torch.Tensor'>
            wav = read_audio(temp_path)

            # speech_timestamps contain segments of timestamps (time in samples not in millisecond)
            speech_timestamps = get_speech_timestamps(
                wav, vad_model
            )  # Default sampling_rate = 16kHz

            try:

                # Gather all tensor audio file chunk before transcribe once
                segment_tensors = [
                    wav[
                        segment["start"] : segment["end"]
                    ]  # Select segment that voice acitivity can detect
                    for segment in speech_timestamps
                ]

                # Format timestamps into hh:mm:ss format
                formatted_timestamps = [
                    formattedTime(
                        segment["start"] // SAMPLING_RATE
                    )  # Convert sample unit to second unit then formatted into hh:mm:ss
                    for segment in speech_timestamps
                ]

                # Return as generator object in memory, need convert to list for readability
                transcripts = list(
                    asr_model.transcribe_generator(segment_tensors, config)
                )[0] # [[content]][0] -> [content]

                # Result formatted before sent to front endd
                transcribed_output = [
                    f"{timestamp}: {transcript.text}"
                    for timestamp, transcript in zip(formatted_timestamps, transcripts)
                ]

                return {"text": "\n".join(transcribed_output)}

            except Exception as e:
                print("ASR Transcribe Error", e)

        except Exception as e:
            print("VAD Process Error:", e)

    except Exception as e:
        print("Error while convert sound file", e)

    finally:
        os.remove(temp_path)