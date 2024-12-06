export const generatePublicFileUrl = (
  host: string,
  port: string,
  bucketName: string,
  fileName: string,
  isProd?: boolean,
  region?: string,
): string => {
  if (isProd) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  }

  return `http://${host}:${port}/${bucketName}/${fileName}`;
};
