// One-off: converts the newly supplied real property photos (PNG, from
// phone/CCTV screenshots) into compressed, appropriately-named JPEGs under
// public/images, matching the site's existing real-*.jpg convention.
import sharp from "sharp";
import { renameSync } from "node:fs";

const SRC_DIR =
  "C:/Users/safur/AppData/Local/Temp/claude/f4e92880d77f8d54/b03a7e94-d92e-4420-9723-bd376b051608/images";
const OUT_DIR = "public/images";
const MAX_WIDTH = 1920;
const QUALITY = 80;

const mapping = [
  ["3.png", "real-bedroom-leaf-wall.jpg"],
  ["4.png", "real-bedroom-palm-wall.jpg"],
  ["5.png", "real-gate-welcome.jpg"],
  ["6.png", "real-aerial-cctv.jpg"],
  ["7.png", "real-pool-exterior-bright.jpg"],
  ["8.png", "real-pool-exterior-cloudy.jpg"],
  ["9.png", "real-playground-slide.jpg"],
  ["10.png", "real-dining-outdoor-01.jpg"],
  ["11.png", "real-pergola-mural.jpg"],
  ["12.png", "real-pool-pergola.jpg"],
  ["13.png", "real-dining-outdoor-02.jpg"],
  ["14.png", "real-campfire-pit.jpg"],
];

for (const [src, outName] of mapping) {
  const srcPath = `${SRC_DIR}/${src}`;
  const outPath = `${OUT_DIR}/${outName}`;
  const img = sharp(srcPath, { failOn: "none" });
  const meta = await img.metadata();
  const resizeOpts = meta.width && meta.width > MAX_WIDTH ? { width: MAX_WIDTH } : undefined;
  const buffer = await img
    .resize(resizeOpts)
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();
  await sharp(buffer).toFile(outPath + ".tmp");
  renameSync(outPath + ".tmp", outPath);
  console.log(`${src} -> ${outName} (${(buffer.length / 1024).toFixed(0)}KB)`);
}
