export const buildMinioFileUrl = (
  host: string,
  port: string,
  bucketName: string,
  fileName: string,
): string => {
  return `https://${host}:${port}/${bucketName}/${fileName}`;
};
