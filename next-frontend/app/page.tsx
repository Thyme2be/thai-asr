"use client";
import React, { useRef, useState } from "react";

const SoundWaveIcon = () => (
  <svg fill="#d60000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M13,4V20a1,1,0,0,1-2,0V4a1,1,0,0,1,2,0ZM8,5A1,1,0,0,0,7,6V18a1,1,0,0,0,2,0V6A1,1,0,0,0,8,5ZM4,7A1,1,0,0,0,3,8v8a1,1,0,0,0,2,0V8A1,1,0,0,0,4,7ZM16,5a1,1,0,0,0-1,1V18a1,1,0,0,0,2,0V6A1,1,0,0,0,16,5Zm4,2a1,1,0,0,0-1,1v8a1,1,0,0,0,2,0V8A1,1,0,0,0,20,7Z"></path>
    </g>
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>{" "}
    </g>
  </svg>
);

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <main className=" h-screen ">
      {/* Header */}
      <header className=" h-1/6 bg-blue-700 flex flex-col justify-center items-center gap-2 text-white ">
        <h1 className=" text-4xl font-bold ">Thai-ASR webservice</h1>
        <p>Automatic Recognition Speech for Thai langugae!</p>
      </header>

      {/* Upload Card */}
      <section className=" h-3/4 flex justify-center p-10 ">
        <div className=" border-2 border-blue-700 place-content-between w-fit p-10 rounded-xl shadow-2xl shadow-blue-700 flex flex-col items-center ">
          <h1 className=" text-4xl text-blue-700 font-bold">
            Upload Thai Audio File
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
          {!selectedFile && <p>No file selected</p>}
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className=" hidden "
          />

          {/* Upload and Change audio file button */}
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
        </div>
      </section>
    </main>
  );
}
