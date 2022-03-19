import { useMemo, useState } from "react";
import { useAudioDataContext } from "../../data/AudioDataContext";
import { toError } from "../../misc/error";
import { SetError } from "../../misc/errorHooks";
import { HStack } from "../simples/HStack";
import { NiceButton } from "../simples/NiceButton";
import { VStack } from "../simples/VStack";

export interface RecorderProps {
  setError: SetError;
}

export function Recorder({
  setError,
}: RecorderProps): JSX.Element {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [, setAudio] = useAudioDataContext();

  const onRecordClick = async () => {
    try {
      setError(null);
      setMediaRecorder(null);
      setChunks([]);
      setRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const newRecorder = new MediaRecorder(stream);
      setMediaRecorder(newRecorder);

      newRecorder.ondataavailable = function ({ data }) {
        chunks.push(data);
      };

      newRecorder.onstop = () => {
        const newAudio = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        setAudio(newAudio);
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
      <HStack>
        <NiceButton disabled={recording} onClick={onRecordClick}>
          Record
        </NiceButton>
        <NiceButton disabled={!mediaRecorder || !recording} onClick={onStopClick}>
          Stop
        </NiceButton>
      </HStack>
    </div>
  );
}
