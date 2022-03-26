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