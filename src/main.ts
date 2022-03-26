import toWav from 'audiobuffer-to-wav';
import lamejs from "./lamejs";
import { trimBlob } from './audioHandlers';
import { createEditorContext } from './EditorContext';

const editorContext = createEditorContext();

export function main() {
  $('#record').onclick = onRecordClick;
  $('#stop').onclick = onStopClick;
  $('#trim').onclick = onTrimClick;
}

async function onRecordClick() {
  editorContext.audioRecorder = await createRecorder();
  editorContext.audioRecorder.start();
}

async function onStopClick() {
  editorContext.audioRecorder?.stop();
}

function onTrimClick() {
  trim();
}

async function trim() {
  const startOffsetSec = $<HTMLInputElement>("#trimStartSec").valueAsNumber;
  const endOffsetSec = $<HTMLInputElement>("#trimEndSec").valueAsNumber;

  const nBuf = await trimBlob(
    editorContext.originalAudioBlob,
    startOffsetSec,
    endOffsetSec
  );
  const left = nBuf.getChannelData(0);

  const arrWav = toWav(nBuf);
  const blobWav = new Blob([arrWav]);

  const channels = nBuf.numberOfChannels;
  const sampleRate = nBuf.sampleRate;
  const kBps = 128;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, kBps);

  const samples = new Int16Array(arrWav);
  const mp3Chunks: Int8Array[] = [];
  const chunk = encoder.encodeBuffer(samples);
  if (chunk.length > 0) {
    mp3Chunks.push(chunk);
  }
  const lastChunk = encoder.flush();
  if (lastChunk.length > 0) {
    mp3Chunks.push(lastChunk);
  }
  const mp3Blob = new Blob(mp3Chunks, { type: 'audio/mp3' });

  // setAudioBlob(blobWav, 'wave');
  setAudioBlob(mp3Blob, 'mp3');
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
    setOriginalAudioBlob(blob);
  };

  return recorder;
}

function setOriginalAudioBlob(audioBlob: Blob) {
  editorContext.originalAudioBlob = audioBlob;
  setAudioBlob(audioBlob, 'ogg');
}

function setAudioBlob(audioBlob: Blob, type: 'wave' | 'ogg' | 'mp3') {
  editorContext.audioBlob = audioBlob;
  editorContext.audioType = type;
  const url = URL.createObjectURL(audioBlob);
  setPlayerUrl(url);
  addDownloadLink(url);
}

function setPlayerUrl(url: string) {
  const elPlayer =
    editorContext.audioType === "mp3"
      ? $<HTMLAudioElement>('#player-mp3')
      : $<HTMLAudioElement>('#player');
  elPlayer.src = url;
}

function addDownloadLink(url: string) {
  const text = new Date().toISOString();
  const ext = {
    "": "",
    mp3: ".mp3",
    ogg: ".oga",
    wave: ".wav",
  }[editorContext.audioType];

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
