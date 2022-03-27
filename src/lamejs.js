// @ts-check

/**
 * @typedef {{
 *   Mp3Encoder: Mp3Encoder;
 *   WavHeader: {
 *     readonly data: 1684108385;
 *     readonly fmt_: 1718449184;
 *     readonly RIFF: 1380533830;
 *     readonly WAVE: 1463899717;
 *     readHeader(dataView: DataView): WavHeaderInstance;
 *   };
 * }} LameJs
 * @typedef {{
 *   new (
 *     channels: number,
 *     sampleRate: number,
 *     kBps: number
 *   ): Mp3Encoder;
 *   encodeBuffer(center: ArrayLike<number>): Int8Array;
 *   encodeBuffer(left: ArrayLike<number>, right: ArrayLike<number>): Int8Array;
 *   flush(): Int8Array;
 * }} Mp3Encoder
 * @typedef {{
 *   channels: number;
 *   dataLen: number;
 *   dataOffset: number;
 *   sampleRate: number;
 * }} WavHeaderInstance
 */

/** @type {LameJs} */
const lamejs = require("lamejs");

module.exports = lamejs;
