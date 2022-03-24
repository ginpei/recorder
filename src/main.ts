let audioRecorder: MediaRecorder | null = null;
let audioBlob = new Blob();

export function main() {
  $('#record').onclick = onRecordClick;
  $('#stop').onclick = onStopClick;
  $('#cut1').onclick = onCut1Click;
}

async function onRecordClick() {
  audioRecorder = await createRecorder();
  audioRecorder.start();
}

async function onStopClick() {
  audioRecorder?.stop();
}

async function onCut1Click() {
  const context = new AudioContext();
  const oBuf = await context.decodeAudioData(await audioBlob.arrayBuffer());

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

  // WIP
  console.log('# duration', `${oBuf.duration} -> ${nBuf.duration}`);
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
