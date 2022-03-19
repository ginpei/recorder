import { useError } from "../../../misc/errorHooks";
import { BasicLayout } from "../../layouts/BasicLayout";
import { Recorder } from "../../complexes/Recorder";
import { AudioDataContextProvider, useAudioDataValue } from "../../../data/AudioDataContext";

export interface RecorderPageProps {
}

export function RecorderPage(props: RecorderPageProps): JSX.Element {
  const [error, setError] = useError();
  const audioDataValue = useAudioDataValue();

  return (
    <AudioDataContextProvider value={audioDataValue}>
      <BasicLayout>
        {error && (<div>ERROR: {error.message}</div>)}
        <Recorder setError={setError} />
      </BasicLayout>
    </AudioDataContextProvider>
  );
}
