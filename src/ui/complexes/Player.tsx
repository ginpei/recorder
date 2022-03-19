import { useAudioDataContext } from "../../data/AudioDataContext";

export interface PlayerProps {
}

export function Player(props: PlayerProps): JSX.Element {
  const [audioUrl] = useAudioDataContext();

  return (
    <div className="Player">
      <audio controls src={audioUrl}></audio>
    </div>
  );
}
