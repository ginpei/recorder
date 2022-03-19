import { createContext, useContext, useMemo, useState } from "react";

export interface AudioData {
  audio: Blob;
  setAudio: React.Dispatch<React.SetStateAction<Blob>>;
}

const AudioDataContext = createContext<AudioData>(null as any);

export const AudioDataContextProvider = AudioDataContext.Provider;

export function useAudioDataValue(): AudioData {
  const [audio, setAudio] = useState(new Blob());
  return { audio, setAudio };
}

export function useAudioDataContext(): [string, (audio: Blob) => void] {
  const { audio, setAudio } = useContext(AudioDataContext);

  const url = useMemo(() => {
    if (audio.size < 1) {
      return '';
    }

    return URL.createObjectURL(audio);
  }, [audio]);

  return [url, setAudio];
}
