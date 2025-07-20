import nemo.collections.asr as nemo_asr
import shutil
import tempfile
import os
from fastapi import UploadFile
from silero_vad import load_silero_vad, read_audio, get_speech_timestamps

# Higher BATCH_SIZE will consume more computer resource, but faster process

# Loading Model
try:

    # Voice Acitivity Detection (VAD) model
    vad_model = load_silero_vad()

    # Transcribe model
    asr_model = nemo_asr.models.EncDecCTCModelBPE.restore_from(
        "app/ai-models/stt_th_fastconformer_ctc_large_nacc_data.nemo"
    )

    asr_model.eval()  # More consistent result since neuron are active for evaluation mode
    
    # Config for .transcribe_generator()
    config = asr_model.get_transcribe_config()
    config.batch_size = 32 # Higher will process faster, but consume more computer resource
    
    # Config ASR Transducer Decoding
    decoding_cfg = asr_model.cfg.decoding
    decoding_cfg.strategy = "greedy_batch"
    asr_model.change_decoding_strategy(decoding_cfg) # asr_model.change_decoding_strategy(decoding_cfg={"strategy": "greedy_batch"})
    
except Exception as e:
    print("Error occurred during loading AI model", e)

# Async if need
def vad_audio_file(file: UploadFile):

    try:
        with tempfile.NamedTemporaryFile("wb", delete=False, suffix=".wav") as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        try:
            
            # wav contain <class 'torch.Tensor'>
            wav = read_audio(temp_path)
            
            # speech_timestamps contain segments of timestamps
            speech_timestamps = get_speech_timestamps(wav, vad_model) # Default sampling_rate = 16kHz
            
            try:
                
                segment_tensors = [] # Gather all tensor audio file chunk before transcribe once
                for segment in speech_timestamps:
                    audio_chunk = wav[segment['start']:segment['end']]
                    segment_tensors.append(audio_chunk)
                    
                # TODO: Transcribe `segment_tensors` using `transcribe_generator(segment_tensors, config)`
                    
            except Exception as e:
              print('ASR Transcribe Error', e)

        except Exception as e:
            print("VAD Process Error:", e)

    except Exception as e:
        print("Error while convert sound file", e)

    finally:
        os.remove(temp_path)


# Make temporary file and Transcribe audio file
async def transcribe_audio_file(file: UploadFile):
    pass
    # try:
    #     output = asr_model.transcribe([temp_path])

    # except Exception as e:
    #     print("Error while transcription sound", e)

    # return output[0].text