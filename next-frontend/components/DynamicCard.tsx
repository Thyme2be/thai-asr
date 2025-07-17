"use client";

import { useRef, useState } from "react";
import SoundWaveIcon from "./icons/SoundWaveIcon";
import UploadIcon from "./icons/UploadIcon";
import Microphone from "./icons/Microphone";

const DynamicCard = ({ cardType }: { cardType: string }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLongForm = cardType === "long-form";

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !file.type.startsWith("audio/")) {
      setErrorMessage("FILE TYPE ERROR: Please upload ONLY AUDIO file!");
      setSelectedFile(null);
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file || null);
  };
  return (
    <section className=" flex justify-center p-10 ">
      <div className=" flex flex-col items-center place-content-between p-5 h-[55vh] card ">
        <h1 className=" text-4xl text-blue-700 font-bold">
          {isLongForm ? "Upload Thai Audio File" : "Talk to your microphone"}
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
          accept="audio/*"
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
            {selectedFile && (
              <button className=" flex justify-center items-center text-white text-xl mt-2 bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700 cursor-pointer shadow-lg rounded-3xl p-2 ">
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
