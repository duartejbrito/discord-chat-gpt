import sharp, { OverlayOptions } from 'sharp';
import { IMAGE_SIZE } from './constants';

export async function createTiledComposite(imageBuffers: Buffer[]): Promise<Buffer> {
  const finalCompositeSize = Math.ceil(Math.sqrt(imageBuffers.length));
  const images: OverlayOptions[] = [];

  imageBuffers.forEach(function (b, i) {
    images.push({
      input: b,
      left: (i % finalCompositeSize) * IMAGE_SIZE,
      top: Math.floor(i / finalCompositeSize) * IMAGE_SIZE,
    });
  });
  return await sharp({
    create: {
      width: IMAGE_SIZE * finalCompositeSize,
      height: Math.ceil(imageBuffers.length / finalCompositeSize) * IMAGE_SIZE,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })
    .composite(images)
    .png()
    .toBuffer();
}

export async function extractImagesFromComposite(composite: Buffer, compositeWidth: number, compositeHeight: number, numberOfImages: number): Promise<Buffer[]> {
  const images = [];
  let i = 0;
  for (let y = 0; y <= compositeHeight - IMAGE_SIZE; y += IMAGE_SIZE) {
    for (let x = 0; x <= compositeWidth - IMAGE_SIZE; x += IMAGE_SIZE) {
      const image = await sharp(composite).extract({ left: x, top: y, width: IMAGE_SIZE, height: IMAGE_SIZE }).png().toBuffer();

      images.push(image);

      i += 1;
      if (i == numberOfImages) {
        return images;
      }
    }
  }

  return images;
}
