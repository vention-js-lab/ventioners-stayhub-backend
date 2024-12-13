export const generatePublicFileUrl = (
  host: string,
  port: string,
  bucketName: string,
  fileName: string,
  isProd?: boolean,
  cdnUrl?: string,
): string => {
  if (isProd) {
    return `${cdnUrl}/${fileName}`;
  }

  return `http://${host}:${port}/${bucketName}/${fileName}`;
};
