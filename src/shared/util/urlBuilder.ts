export const buildMinioFileUrl = (
  host: string,
  port: string,
  bucketName: string,
  fileName: string,
): string => {
  // TODO: add support for https
  return `http://${host}:${port}/${bucketName}/${fileName}`;
};
