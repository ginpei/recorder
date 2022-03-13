import { useError } from './misc/errorHooks';
import { BasicLayout } from './ui/layouts/BasicLayout';
import { Recorder } from './ui/simples/Recorder';

function App() {
  const [error, setError] = useError();

  return (
    <BasicLayout>
      {error && (<div>ERROR: {error.message}</div>)}
      <Recorder setError={setError} />
    </BasicLayout>
  )
}

export default App
