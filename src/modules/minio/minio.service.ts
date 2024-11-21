import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isProd } from 'src/shared/helpers';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_HOST'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: isProd(this.configService.get('NODE_ENV')),
      accessKey: this.configService.get('MINIO_ROOT_USER'),
      secretKey: this.configService.get('MINIO_ROOT_PASSWORD'),
    });

    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
    this.createBucketIfNotExists();
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);

      const bucketPolicyRead = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(bucketPolicyRead),
      );
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;

    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
      );

      return fileName;
    } catch (err) {
      throw new InternalServerErrorException('Object upload failed');
    }
  }

  async deleteFile(fileName: string) {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Object removal failed');
    }
  }

  async deleteFiles(fileNames: string[]) {
    try {
      await this.minioClient.removeObjects(this.bucketName, fileNames);
    } catch (err) {
      throw new InternalServerErrorException('Objects removal failed');
    }
  }
}
