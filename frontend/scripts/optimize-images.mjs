// One-off/rerunnable image compressor: resizes to a sane max width and
// re-encodes as progressive mozjpeg, in place, only when it actually shrinks
// the file. Run with: node scripts/optimize-images.mjs public/images
import sharp from "sharp";
import { readdirSync, statSync, renameSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.argv[2];
if (!ROOT) {
  console.error("usage: node optimize-images.mjs <dir>");
  process.exit(1);
}

const MAX_WIDTH = 1920;
const QUALITY = 74;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if ([".jpg", ".jpeg"].includes(extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const before = statSync(file).size;
  totalBefore += before;

  const img = sharp(file, { failOn: "none" });
  const meta = await img.metadata();
  const resizeOpts = meta.width && meta.width > MAX_WIDTH ? { width: MAX_WIDTH } : undefined;

  const buffer = await img
    .resize(resizeOpts)
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();

  if (buffer.length < before) {
    await sharp(buffer).toFile(file + ".tmp");
    renameSync(file + ".tmp", file);
    totalAfter += buffer.length;
    console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB`);
  } else {
    totalAfter += before;
    console.log(`${file}: skipped (already optimal, ${(before / 1024).toFixed(0)}KB)`);
  }
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`,
);
