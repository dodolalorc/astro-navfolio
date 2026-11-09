import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

// Validate the delivered binary, independently of the generator's write logic.
const file = await readFile('public/favicon.ico');
assert.deepEqual([...file.subarray(0, 6)], [0, 0, 1, 0, 3, 0], 'ICO header');
const expectedSizes = [16, 32, 48];
let nextImageOffset = 54;

for (const [index, size] of expectedSizes.entries()) {
  const entry = 6 + index * 16;
  assert.deepEqual(
    [...file.subarray(entry, entry + 8)],
    [size, size, 0, 0, 1, 0, 32, 0],
    `${size}px: dimensions, reserved bytes, planes=1, bit count=32`,
  );
  const length = file.readUInt32LE(entry + 8);
  const offset = file.readUInt32LE(entry + 12);
  assert.equal(offset, nextImageOffset, `${size}px: contiguous image offset`);
  assert(length > 0 && offset + length <= file.length, `${size}px: image bounds`);
  const payload = file.subarray(offset, offset + length);
  assert.deepEqual([...payload.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const { info } = await sharp(payload).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, size);
  assert.equal(info.height, size);
  assert.equal(info.channels, 4);
  nextImageOffset = offset + length;
}
assert.equal(nextImageOffset, file.length, 'No trailing or missing image data');
console.log('Verified ICO directory fields and decoded all three PNG images.');
