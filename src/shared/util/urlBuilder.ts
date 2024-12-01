export const buildMinioFileUrl = (
  host: string,
  port: string,
  bucketName: string,
  fileName: string,
): string => {
  return `http://${host}:${port}/${bucketName}/${fileName}`;
};
