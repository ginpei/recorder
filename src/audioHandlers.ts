import lamejs from "./lamejs";

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
  const kBps = 128;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, kBps);

  const wavHeader = lamejs.WavHeader.readHeader(new DataView(arrWav));
  const samples = new Int16Array(arrWav, wavHeader.dataOffset, wavHeader.dataLen / 2);

  const mp3Chunks: Int8Array[] = [];
  console.time(`# encode`);
  const chunk = encoder.encodeBuffer(samples);
  console.timeEnd(`# encode`);
  if (chunk.length > 0) {
    mp3Chunks.push(chunk);
  }
  const lastChunk = encoder.flush();
  if (lastChunk.length > 0) {
    mp3Chunks.push(lastChunk);
  }
  const mp3Blob = new Blob(mp3Chunks, { type: 'audio/mp3' });

  return mp3Blob;
}
