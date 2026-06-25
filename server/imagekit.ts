import ImageKit, { toFile } from '@imagekit/nodejs';

function getImageKit() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is not configured in .env');
  }

  // v7 SDK: only needs privateKey — no publicKey or urlEndpoint in constructor
  return new ImageKit({ privateKey });
}

/**
 * Upload a file buffer to ImageKit.
 * Accepts images and GIFs (any image/* mime type).
 * Returns the public CDN URL and fileId for storage.
 */
export async function uploadToImageKit(
  fileBuffer: Buffer,
  fileName: string,
): Promise<{ url: string; fileId: string }> {
  const ik = getImageKit();

  // Strip extension for a clean name, add timestamp to avoid collisions
  const baseName = fileName.replace(/\.[^.]+$/, '');
  const ext = fileName.split('.').pop() ?? 'jpg';
  const uploadName = `${baseName}_${Date.now()}.${ext}`;

  // v7 SDK requires toFile() helper to wrap a Buffer
  const uploadable = await toFile(fileBuffer, uploadName);

  const result = await ik.files.upload({
    file: uploadable,
    fileName: uploadName,
    folder: '/portfolio/projects',
    useUniqueFileName: false,
  });

  return {
    url: result.url ?? '',
    fileId: result.fileId ?? '',
  };
}

/**
 * Delete a file from ImageKit by its fileId.
 * Safe to call with an empty string (no-op).
 */
export async function deleteFromImageKit(fileId: string): Promise<void> {
  if (!fileId) return;
  try {
    const ik = getImageKit();
    await ik.files.delete(fileId);
  } catch (err) {
    // Log but don't throw — a failed delete shouldn't block the main operation
    console.warn('[ImageKit] Failed to delete file:', fileId, err);
  }
}
