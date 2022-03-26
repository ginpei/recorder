import toWav from 'audiobuffer-to-wav';

interface EditorContext {
  audioBlob: Blob;
  audioRecorder: MediaRecorder | null;
  audioType: '' | 'wave' | 'ogg';
}

const editorContext: EditorContext = {
  audioBlob: new Blob(),
  audioRecorder: null,
  audioType: '',
};

export function main() {
  $('#record').onclick = onRecordClick;
  $('#stop').onclick = onStopClick;
  $('#cut1').onclick = onCut1Click;
}

async function onRecordClick() {
  editorContext.audioRecorder = await createRecorder();
  editorContext.audioRecorder.start();
}

async function onStopClick() {
  editorContext.audioRecorder?.stop();
}

async function onCut1Click() {
  const context = new AudioContext();
  const oBuf = await context.decodeAudioData(await editorContext.audioBlob.arrayBuffer());

  const offsetSec = 1.00;
  const offset = offsetSec * oBuf.sampleRate;
  const numChannel = oBuf.numberOfChannels;
  const length = oBuf.length - offset;

  if (length < 1) {
    throw new Error("Not enough duration");
  }

  const nBuf = context.createBuffer(numChannel, length, oBuf.sampleRate);

  for (let iChannel = 0; iChannel < numChannel; iChannel++) {
    const oData = oBuf.getChannelData(iChannel);
    const nData = nBuf.getChannelData(iChannel);
    for (let iBuf = 0; iBuf < length; iBuf++) {
      nData[iBuf] = oData[offset + iBuf];
    }
  }

  const arrWav = toWav(nBuf);
  const blobWav = new Blob([arrWav]);
  setAudioBlob(blobWav, 'wave');
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
    setAudioBlob(blob, 'ogg');
  };

  return recorder;
}

function setAudioBlob(audioBlob: Blob, type: 'wave' | 'ogg') {
  editorContext.audioBlob = audioBlob;
  editorContext.audioType = type;
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
  const ext = editorContext.audioType === 'wave' ? '.wav' : '.ogg';

  const el = document.createElement('a');
  el.download = `${text}${ext}`;
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
