// @ts-check

/**
 * @typedef {{
 *   Mp3Encoder: {
 *     new (
 *       channels: number,
 *       sampleRate: number,
 *       kBps: number
 *     ): {
 *       encodeBuffer(center: ArrayLike<number>): Int8Array;
 *       encodeBuffer(left: ArrayLike<number>, right: ArrayLike<number>): Int8Array;
 *       flush(): Int8Array;
 *     };
 *   };
 *   WavHeader: {
 *     readonly data: 1684108385;
 *     readonly fmt_: 1718449184;
 *     readonly RIFF: 1380533830;
 *     readonly WAVE: 1463899717;
 *     readHeader(dataView: DataView): {
 *       channels: number;
 *       dataLen: number;
 *       dataOffset: number;
 *       sampleRate: number;
 *     };
 *   };
 * }} LameJs
 */

/** @type {LameJs} */
const lamejs = require("lamejs");

module.exports = lamejs;
