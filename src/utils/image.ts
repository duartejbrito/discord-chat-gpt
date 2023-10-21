import sharp, { OverlayOptions } from "sharp";
import { IMAGE_SIZE } from "./constants";

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