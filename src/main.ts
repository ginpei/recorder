import toWav from 'audiobuffer-to-wav';
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
    setOriginalAudioBlob(blob);
  };

  return recorder;
}

function setOriginalAudioBlob(audioBlob: Blob) {
  editorContext.originalAudioBlob = audioBlob;
  setAudioBlob(audioBlob, 'ogg');
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
