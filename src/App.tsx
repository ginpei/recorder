import { BasicLayout } from './layouts/BasicLayout';
import { useError } from './misc/error';
import { Recorder } from './simples/Recorder';

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
