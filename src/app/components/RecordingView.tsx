"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface timeInterface {
  ms: number;
  s: number;
}

export default function RecordingView() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingComplete, setRecordingComplete] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>();

  const [requiredWordSpoken, setRequiredWordSpoken] = useState<boolean>();
  let requiredWord = "okay";

  const recognitionRef = useRef<any>(null);

  const [time, setTime] = useState<timeInterface>({ ms: 0, s: 0 });
  const [interv, setInterv] = useState<any>();

  var updatedMs = time.ms,
    updatedS = time.s;

  const start = () => {
    run();
    setInterv(setInterval(run, 10));
  };

  const run = () => {
    if (updatedMs === 100) {
      updatedS++;
      updatedMs = 0;
    }
    updatedMs++;
    return setTime({ ms: updatedMs, s: updatedS });
  };

  const stop = () => {
    clearInterval(interv);
  };

  const startRecording = () => {
    setIsRecording(true);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const { transcript } = event.results[event.results.length - 1][0];

      setTranscript(transcript);

      if (transcript.includes(requiredWord)) {
        stopRecording()
        setRequiredWordSpoken(true);
        setRecordingComplete(true);
      }
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    if(requiredWordSpoken){
      stop()
    }
  }, [requiredWordSpoken])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stop()
    setIsRecording(false);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
        <div className=" text-black">Time taken - {time.s + " seconds " + time.ms + " milliseconds"}</div>
      {/* Transcript section */}
      <div className=" w-full">
        {(isRecording || transcript) && (
          <div className="w-1/4 m-auto rounded-md border p—4 bg—white">
            <div className="flex-1 flex w-full justify-between">
              <div className="space-y-1">
                <p className="text-sm font—medium leading-none">
                  {/* {recordingComplete ? "Recorded" : "Recording"} */}
                </p>
                <p className="text-sm">
                  {recordingComplete
                    ? "Thanks for talking"
                    : "Start speaking..."}
                </p>
                <div className=" text-red-500">
                  {requiredWordSpoken ? "Spoken" : ""}
                </div>
              </div>
              {isRecording && (
                <div className="rounded—full w—4 h—4 bg-red—4ØØ animate—pulse" />
              )}
            </div>
            {transcript && (
              <div className="border rounded-md p-2 mt-4">
                <p className="mb-0">{transcript}</p>
              </div>
            )}
          </div>
        )}

        {/* Button Section */}
        <div className="flex items-center w-full">
          {isRecording ? (
            <button
              onClick={() => {handleToggleRecording();}}
              className=" rounded-full w-20 h-20 mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500"
            >
              <svg
                className="w-12 h-12"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="#ffffff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 5.5v13c0 .465 0 .697.038.89a2 2 0 0 0 1.571 1.572c.194.038.426.038.89.038c.465 0 .698 0 .892-.038a2 2 0 0 0 1.57-1.572c.039-.19.039-.42.039-.878V5.488c0-.457 0-.687-.038-.879a2 2 0 0 0-1.572-1.57C18.197 3 17.965 3 17.5 3s-.697 0-.89.038a1.999 1.999 0 0 0-1.572 1.571C15 4.803 15 5.035 15 5.5m-11 0v13c0 .465 0 .697.038.89a2 2 0 0 0 1.571 1.572c.194.038.426.038.89.038c.465 0 .698 0 .892-.038a2 2 0 0 0 1.57-1.572C9 19.2 9 18.97 9 18.512V5.488c0-.457 0-.687-.038-.879A2 2 0 0 0 7.39 3.04C7.197 3 6.965 3 6.5 3s-.697 0-.89.038A1.999 1.999 0 0 0 4.037 4.61C4 4.803 4 5.035 4 5.5"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {handleToggleRecording(); start()}}
              className=" rounded-full w-20 h-20 mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500"
            >
              <svg
                className="w-12 h-12"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  fill="none"
                  stroke="#ffffff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <rect width="8" height="13" x="8" y="2" rx="4" />
                  <path d="M18 16.292A7.98 7.98 0 0 1 12 19a7.98 7.98 0 0 1-6-2.708M12 19v3m-2 0h4" />
                </g>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
