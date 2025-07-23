"use client";

import { DynamicCardProps } from "@/types/props";
import { useRef, useState } from "react";
import {
  Microphone,
  SoundWaveIcon,
  UploadIcon,
} from "@/components/icons/icons-index";

const TEXT = {
  uploadTitle: "Upload Thai Audio File",
  micTitle: "Talk to your microphone",
  noFile: "No file selected",
  fileTypeError: "FILE TYPE ERROR: Please upload ONLY .wav audio file!",
};

const DynamicCard = ({ cardType, transcribeText }: DynamicCardProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLongForm = cardType === "long-form";

  const isValidAudio = (file: File) => {
    return (
      file.type === "audio/wav" || file.name.toLowerCase().endsWith(".wav")
    );
  };

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isValidAudio(file)) {
      setErrorMessage(TEXT.fileTypeError);
      return setSelectedFile(null);
    }
    setErrorMessage(null);
    setSelectedFile(file || null);
  };

  const handleTranscribe = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      console.error(
        "ERROR FILE NOT FOUND: There are no .wav file to transcribe"
      );
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/file-asr/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json()
        throw new Error("Error POST to back end server", error)
      }

      const data = await response.json();
      transcribeText(data.text)
    } catch (error) {
      console.error("Error sending file to backend", error);
    }
  };

  return (
    <section className=" flex justify-center p-10 ">
      <div className=" flex flex-col items-center place-content-between p-5 h-[55vh] card ">
        <h1 className=" text-4xl text-blue-700 font-bold">
          {isLongForm ? TEXT.uploadTitle : TEXT.micTitle}
        </h1>

        {/* Display Uploaded file or Error */}
        {selectedFile && (
          <div className=" flex flex-col justify-center items-center gap-2">
            <div className=" h-20 w-20 ">
              <SoundWaveIcon />
            </div>
            <p className=" text-2xl font-bold ">{`${selectedFile.name}`}</p>
          </div>
        )}

        {isLongForm && !selectedFile && <p>No file selected</p>}
        <input
          id="audio-upload"
          type="file"
          accept=".wav, audio/wav"
          ref={fileInputRef}
          onChange={handleFileChange}
          className=" hidden "
        />

        {/* Upload and Change audio file button */}
        {isLongForm && (
          <div className=" flex flex-col justify-center ">
            <button
              onClick={handleFileUpload}
              className=" flex justify-center text-xl text-white items-center gap-2 border-2 border-blue-700 bg-blue-700 hover:bg-blue-800 hover:border-blue-800 rounded-3xl px-4 py-2 cursor-pointer shadow-lg w-full "
            >
              {selectedFile ? "Change audio file" : "Upload audio file"}
              <div className=" h-10 w-10 ">
                <UploadIcon />
              </div>
            </button>

            {/* Transcrib Button */}
            {selectedFile && (
              <button
                onClick={handleTranscribe}
                className=" flex justify-center items-center text-white text-xl mt-2 bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700 cursor-pointer shadow-lg rounded-3xl p-2 "
              >
                Transcribe
              </button>
            )}

            {errorMessage && (
              <p className=" text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>
        )}

        {/* Streaming Microphone */}
        {!isLongForm && (
          <div className=" w-14 h-14 bg-red-600 hover:bg-red-800 cursor-pointer p-2 rounded-full">
            <Microphone />
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicCard;
