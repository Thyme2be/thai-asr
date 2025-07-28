# **How it's work?**

## Long Form Transcription

1. **Upload `.wav`**
   User has to upload their audio file (only for `.wav` file) into the website.

- Drag and drop in soon feature
- Other audio file type will soon support

2. **Validation**
   Once use upload their file, the file will get validate by front end

- If file type <u>invalid</u>:
- Front end will DO NOT except the file and make user to upload their file again
- If file type <u>valid</u>
- Front end will allow user to click button `transcribe`

3. **Process**
   Once file get validate and pass into back end when user clicked `transcribe` button

- Front end will send `POST` HTTP method to back end via back end server (`http://127.0.0.1:8000`)
- Then route the request to api `/api/file-asr/upload`
- Next, the file will be process by `Fastconformer` model and output as transcribe text
- Finally, server return the output into front end

# **Setup Website**

## Setup dependencies

1. Install Nemo Framework:
   1.1 Follow official document step but change the name from `nemo` to `thai-asr` conda environment
   - doc: `https://docs.nvidia.com/nemo-framework/user-guide/latest/installation.html`
     1.2 Update `pytorch` version to `pytorch=2.7.1`
2. Install `Node Package Manager`
3. If you're using Windows OS, Install **Windows Sub Linux (WSL)**

## Start Website

**USE THIS COMMAND: `. run.sh`** (Make sure you're in root folder)

OR

1. For front end:
   1.1 Access into next-frontend directory
   using `cd next-frontend`
   1.2 Install `npm` dependencies and packages
   using `npm i`
   1.3 Start development server
   using `npm run dev`

2. For back end:
   2.1 Access into fastapi-backend directory
   using `cd fastapi-backend`
   2.2 Activate **Conda** environment
   using `conda activate thai-asr`
   2.3 Start development server
   using `fastapi dev app/main.py`

# **Prerequisites**

## For Windows OS, ack end server **MUST run in WSL** (Windows sub linux)

## ASR model can accepts input:

- `.wav` file type
- 16000 Hz Mono-channel
  **If the sound file isn't <u>**16kHz**</u> with <u>**Mono-channel**</u>. You have to convert it before use `.transcribe()` or `.transcribe_generator()`**
- Consume GPU resource

## Silero VAD can accept:

- Silero VAD supports **8000 Hz** and **16000 Hz** sampling rates.
- Accept only <u>**Mono-channel**</u>
- Consume CPU resources

DeepWiki: https://deepwiki.com/snakers4/silero-vad/4-basic-usage

# **Structure**

1. In front end page, we created only one single page with dynamic component. So both feature `Long Form` and `Streaming` will have shared states and mostly use the same components.

# **Possiblity Error**

## **`No module named 'torch.nn.attention'`**

Error occured when Pytorch version when installing with **Nemo Framework** document is version `pytorch=2.2.0`

> Upgrade to `pytorch=2.7.1` to resolve the error

# **Bug Report**

## Error WSL down when `.transcribe_generator()` in `file_transcriber.py`
Bug resolved!: DO NOT use `config.batch_size = ` command

## when use `.transcribe_generator()` it output not full context in voice
Bug resolved!: 
Bad code `transcripts_result = list(asr_model.transcribe_generator(segment_tensors, config))[0]`
Fix code `transcripts_result = list(asr_model.transcribe_generator(segment_tensors, config))` Remove `[0]`
Since we use `batch_size = 4` (default), it will create list with every 4 audio chunk transcribed

## Error when run inference the deployed model `.rmir`
Bug resolved!:
when building `.rmir` file to `.riva`, use `--ms_per_timestep=80 \` flag to make model match with the sound file

# Silero-vad (For Voice Activity Detection) Materials:

Github Official: https://github.com/snakers4/silero-vad
Github Colab Example: https://github.com/snakers4/silero-vad/blob/master/silero-vad.ipynb

For Straming use `class VADIterator`
Github: https://github.com/snakers4/silero-vad/blob/94811cbe1207ec24bc0f5370b895364b8934936f/src/silero_vad/utils_vad.py#L398

# Tips:

1. `SAMPLING_RATE` means analog signal to store and process sound by convert into digital signal. It's measured in Hz or kHz. Typically in nowaday headphone has 48 kHz or 44,100 kHz which is 48,000 or 44,100 samples taken per seconds.

- Higher `SAMPLING_RATE` means more sound's detail and accurate

2. There is no need to be `file_path` for `.transcribe()`. You can use `numpy_arrays` which from `.wav` to transcribe the sound. BUT, you have to follow these steps:
   Github use `soundfile`: https://docs.nvidia.com/nemo-framework/user-guide/latest/nemotoolkit/asr/results.html#transcribing-inference
   ![alt text](image.png)

3. Use `.transcribe_generator(list(.wav tensor_audio), config))` instead of `.transcribe()`
   Why?: Can handle multi-segments instead of looping into each one

4. When transcribe multi-samples simultaneously, config model's strategy from `greedy` (default) to `greedy_batch` will get better performance

## Greedy vs. Greedy Batch Decoding in ASR

| Feature            | `greedy`                               | `greedy_batch`                               |
| ------------------ | -------------------------------------- | -------------------------------------------- |
| 🧠 Decoding Method | Processes one sample at a time         | Processes multiple samples in parallel       |
| 🔄 Efficiency      | Lower — suitable for debugging/testing | Higher — better for inference speed          |
| 📦 Batch Support   | No                                     | Yes                                          |
| 🪄 Implementation  | Simpler logic                          | Requires optimized batching mechanisms       |
| 📊 Use Case        | Step-by-step analysis, prototyping     | Production-level transcription               |
| 🎯 Output Shape    | Output per individual input            | Batched output matching input batch          |
| 🛠 Compatibility    | Any input shape                        | Requires consistent input lengths or padding |

More: https://docs.nvidia.com/nemo-framework/user-guide/latest/nemotoolkit/asr/configs.html#transducer-decoding

5. To change ASR model config

- Check what can be setting using

```
decoding_cfg = asr_model.cfg.decoding
print(decoding_cfg)
```

- If you want to change config (ex. strategy)

```
decoding_cfg.strategy = "greedy_batch" # change the "strategy" to other thing you want to change
asr_model.change_decoding_strategy(decoding_cfg) # make config change in model
```

or you can use

```
asr_model.change_decoding_strategy(decoding_cfg={"strategy": "greedy_batch"})
```

# Using Riva for streaming
Use Local docker is better for 
- single laptop, 
- lower overhead, 
- great for devlopment/testing 
- mostly use with single laptop.