import { useState } from "react";
import { toError } from "../../misc/error";
import { SetError } from "../../misc/errorHooks";
import { NiceButton } from "./NiceButton";
import { VStack } from "./VStack";

export interface RecorderProps {
  setError: SetError;
}

export function Recorder({
  setError,
}: RecorderProps): JSX.Element {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
  const [recording, setRecording] = useState(false);

  const onRecordClick = async () => {
    try {
      setError(null);
      setMediaRecorder(null);
      setChunks([]);
      setAudioSrc(undefined);
      setRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const newRecorder = new MediaRecorder(stream);
      setMediaRecorder(newRecorder);

      newRecorder.ondataavailable = function ({ data }) {
        chunks.push(data);
      };

      newRecorder.onstop = () => {
        const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        const src = URL.createObjectURL(blob);
        setAudioSrc(src);
      };

      newRecorder.start();
    } catch (error) {
      setError(toError(error));
    }
  };

  const onStopClick = () => {
    try {
      if (!mediaRecorder) {
        throw new Error('MediaRecorder not ready');
      }

      mediaRecorder.stop();
      setRecording(false);
    } catch (error) {
      setError(toError(error));
    }
  };

  return (
    <div className="Recorder">
      <VStack>
        <div>
          <NiceButton disabled={recording} onClick={onRecordClick}>
            Record
          </NiceButton>
          <NiceButton disabled={!mediaRecorder || !recording} onClick={onStopClick}>
            Stop
          </NiceButton>
        </div>
        <div>
          <audio controls src={audioSrc}></audio>
        </div>
      </VStack>
    </div>
  );
}
