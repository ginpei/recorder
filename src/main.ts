let recorder: MediaRecorder | null = null;

export function main() {
  $('#record').onclick = onRecordClick;
  $('#stop').onclick = onStopClick;
}

async function onRecordClick() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const chunks: Blob[] = [];

  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = function ({ data }) {
    chunks.push(data);
  };

  recorder.onstop = () => {
    onRecorderStop(chunks);
  };

  recorder.start();
}

function onStopClick() {
  recorder?.stop();
}

function onRecorderStop(chunks: Blob[]) {
  const audioBlob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });

  setPlayerUrl(URL.createObjectURL(audioBlob));
}

function setPlayerUrl(url: string) {
  $<HTMLAudioElement>('#player').src = url;
}

function $<T extends HTMLElement>(selector: string, parent: Element | Document = document) {
  const el = parent.querySelector<T>(selector);
  if (!(el instanceof HTMLElement)) {
    throw new Error(`Failed to find "${selector}"`);
  }
  return el;
}
