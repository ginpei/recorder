import lamejs from "./lamejs";
import { sleep } from "./misc";

export async function trimBlob(
  blob: Blob,
  startOffsetSec: number,
  endOffsetSec: number
): Promise<AudioBuffer> {
  const originalArrayBuffer = await blob.arrayBuffer();

  const context = new AudioContext();

  // original buffer
  const oBuf = await context.decodeAudioData(originalArrayBuffer);

  const startOffset = startOffsetSec * oBuf.sampleRate;
  const endOffset = endOffsetSec * oBuf.sampleRate;
  const numChannel = oBuf.numberOfChannels;
  const length = oBuf.length - startOffset - endOffset;

  if (length < 1) {
    throw new Error("Not enough duration");
  }

  // new buffer
  const nBuf = context.createBuffer(numChannel, length, oBuf.sampleRate);

  for (let iChannel = 0; iChannel < numChannel; iChannel++) {
    const oData = oBuf.getChannelData(iChannel);
    const nData = nBuf.getChannelData(iChannel);
    for (let iBuf = 0; iBuf < length; iBuf++) {
      nData[iBuf] = oData[startOffset + iBuf];
    }
  }

  return nBuf;
}

export async function wavToMp3(
  arrWav: ArrayBuffer,
  channels: number,
  sampleRate: number
): Promise<Blob> {
  if (channels !== 1) {
    throw new Error(`Unsupported number of channels: ${channels}`);
  }

  const samples = extractSamplesFromWav(arrWav);

  const kBps = 128;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, kBps);
  const mp3Chunks: Int8Array[] = await encodeWavToMp3(encoder, samples);

  const mp3Blob = new Blob(mp3Chunks, { type: 'audio/mp3' });
  return mp3Blob;
}


function extractSamplesFromWav(arrWav: ArrayBuffer) {
  const wavHeader = lamejs.WavHeader.readHeader(new DataView(arrWav));
  const samples = new Int16Array(arrWav, wavHeader.dataOffset, wavHeader.dataLen / 2);
  return samples;
}

async function encodeWavToMp3(encoder: lamejs.Mp3Encoder, samples: Int16Array) {
  const mp3Chunks: Int8Array[] = [];

  // lamejs says a multiple of 576 is better
  // https://github.com/zhuker/lamejs/blob/master/README.md#real-example
  const sampleSize = 2 * 576;

  for (
    let begin = 0, startedAt = Date.now();
    begin < samples.length;
    begin += sampleSize
  ) {
    const end = begin + sampleSize;
    const subSamples = samples.subarray(begin, end);

    const chunk = encoder.encodeBuffer(subSamples);
    if (chunk.length > 0) {
      mp3Chunks.push(chunk);
    }

    // https://www.html5rocks.com/en/tutorials/speed/rendering/
    // (probably there are better explanations for this context)
    // (not junk btw)
    const jankThreshold = 16;

    // avoid from freezing UI
    // TODO move to worker
    if (Date.now() - startedAt > jankThreshold) {
      await sleep(jankThreshold);
      startedAt = Date.now();
    }
  }

  const lastChunk = encoder.flush();
  if (lastChunk.length > 0) {
    mp3Chunks.push(lastChunk);
  }

  return mp3Chunks;
}
