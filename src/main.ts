let audioRecorder: MediaRecorder | null = null;
let audioBlob = new Blob();

export function main() {
  $('#record').onclick = onRecordClick;
  $('#stop').onclick = onStopClick;
}

async function onRecordClick() {
  audioRecorder = await createRecorder();
  audioRecorder.start();
}

async function onStopClick() {
  audioRecorder?.stop();
}

async function createRecorder(): Promise<MediaRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const chunks: Blob[] = [];

  const recorder = new MediaRecorder(stream);

  recorder.ondataavailable = function ({ data }) {
    chunks.push(data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
    setAudioBlob(blob);
  };

  return recorder;
}

function setAudioBlob(newAudioBlob: Blob) {
  audioBlob = newAudioBlob;
  const url = URL.createObjectURL(audioBlob);
  setPlayerUrl(url);
  addDownloadLink(url);
}

function setPlayerUrl(url: string) {
  const elPlayer = $<HTMLAudioElement>('#player');
  elPlayer.src = url;
}

function addDownloadLink(url: string) {
  const text = new Date().toISOString();

  const el = document.createElement('a');
  el.download = `${text}.oga`;
  el.href = url;
  el.textContent = text;

  const li = document.createElement('li');
  li.append(el);

  const elList = $('#links');
  elList.append(li);
}

function $<T extends HTMLElement>(selector: string, parent: Element | Document = document) {
  const el = parent.querySelector<T>(selector);
  if (!(el instanceof HTMLElement)) {
    throw new Error(`Failed to find "${selector}"`);
  }
  return el;
}
