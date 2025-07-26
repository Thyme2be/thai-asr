import riva.client
def run_inference(audio_file, server='localhost:50051', print_full_response=False):
    with open(audio_file, 'rb') as fh:
        data = fh.read()

    auth = riva.client.Auth(uri=server)
    client = riva.client.ASRService(auth)
    config = riva.client.RecognitionConfig(
        language_code="en-US",
        max_alternatives=1,
        enable_automatic_punctuation=False,
    )

    response = client.offline_recognize(data, config)
    if print_full_response: 
        print(response)
    else:
        print(response.results[0].alternatives[0].transcript)
audio_file = "EngTest.wav" # Change file path
run_inference(audio_file)
