import fs from 'node:fs/promises';

export const convertImageSourceToUint8Array = (imageSrc: string) => {
  const data = atob(imageSrc.split(',')[1])
    .split('')
    .map((c) => c.charCodeAt(0));

  return new Uint8Array(data);
};

export const saveUint8ArrayImageToDisk = async (fileName: string, imgSource: Uint8Array): Promise<boolean> => {
  try {
    await fs.writeFile(fileName, imgSource);
    return true;
  } catch (err) {
    return false;
  }
};
