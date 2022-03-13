import { useError } from "../../../misc/errorHooks";
import { BasicLayout } from "../../layouts/BasicLayout";
import { Recorder } from "../../simples/Recorder";

export interface RecorderPageProps {
}

export function RecorderPage(props: RecorderPageProps): JSX.Element {
  const [error, setError] = useError();

  return (
    <BasicLayout>
      {error && (<div>ERROR: {error.message}</div>)}
      <Recorder setError={setError} />
    </BasicLayout>
  );
}
