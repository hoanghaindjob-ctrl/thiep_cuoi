const MIN_PHOTO_BITS_PER_PIXEL = 0.6;
const MIN_PHOTO_PIXELS = 1_000_000;

export type ImageUploadInfo = {
  width: number;
  height: number;
  bitsPerPixel: number;
  looksOverCompressed: boolean;
};

/**
 * A large JPEG can still contain very little real image data. That usually
 * means it was compressed by a chat/social app before it reached the editor.
 */
export async function inspectImageUpload(file: File): Promise<ImageUploadInfo> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  bitmap.close();

  const pixels = width * height;
  const bitsPerPixel = pixels > 0 ? (file.size * 8) / pixels : 0;
  const isJpeg = file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name);

  return {
    width,
    height,
    bitsPerPixel,
    looksOverCompressed:
      isJpeg &&
      pixels >= MIN_PHOTO_PIXELS &&
      bitsPerPixel < MIN_PHOTO_BITS_PER_PIXEL,
  };
}
