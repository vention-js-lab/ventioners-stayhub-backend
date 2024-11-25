import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessPolicy, BucketName } from './minio.constants';
import { isProd } from 'src/shared/helpers';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name, { timestamp: true });

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_HOST'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: isProd(this.configService.get('NODE_ENV')),
      accessKey: this.configService.get('MINIO_ROOT_USER'),
      secretKey: this.configService.get('MINIO_ROOT_PASSWORD'),
    });
  }

  async initializeBucket(
    bucketName = BucketName.Images,
    accessPolicy = AccessPolicy.Private,
  ) {
    await this.createBucketIfNotExists(bucketName);

    if (accessPolicy == AccessPolicy.Public) {
      await this.makeBucketPublic(bucketName);
    }
  }

  private async makeBucketPublic(bucketName: BucketName) {
    const bucketPolicyRead = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    let prevPolicy = bucketPolicyRead;
    try {
      const policy = await this.minioClient.getBucketPolicy(bucketName);
      prevPolicy = JSON.parse(policy);
    } catch (err) {
      this.logger.error('Could not fetch the bucket policy', err.stack);
    }

    if (
      !prevPolicy['Statement'].some(
        (stat: unknown) =>
          stat['Action'].includes('s3:GetObject') &&
          stat['Resource'].includes(`arn:aws:s3:::${bucketName}/*`),
      )
    ) {
      prevPolicy['Statement'].push(bucketPolicyRead.Statement[0]);
    }

    try {
      await this.minioClient.setBucketPolicy(
        bucketName,
        JSON.stringify(prevPolicy),
      );
    } catch (err) {
      this.logger.error('Could not set the bucket policy', err.stack);
      throw new InternalServerErrorException('Failed to initialize bucket');
    }
  }

  private async createBucketIfNotExists(bucketName: BucketName) {
    const bucketExists = await this.minioClient.bucketExists(bucketName);

    if (!bucketExists) {
      await this.minioClient.makeBucket(bucketName);
    }
  }

  async uploadFile(file: Express.Multer.File, bucketName = BucketName.Images) {
    const fileName = `${randomUUID()}-${file.originalname}`;

    try {
      await this.minioClient.putObject(
        bucketName,
        fileName,
        file.buffer,
        file.size,
      );

      return fileName;
    } catch (err) {
      this.logger.error('Could not upload the object', err.stack);
      throw new InternalServerErrorException('Object upload failed');
    }
  }

  async deleteFile(fileName: string, bucketName = BucketName.Images) {
    try {
      await this.minioClient.removeObject(bucketName, fileName);
    } catch (err) {
      this.logger.error('Could not delete the object', err.stack);
      throw new InternalServerErrorException('Object removal failed');
    }
  }

  async deleteFiles(fileNames: string[], bucketName = BucketName.Images) {
    try {
      await this.minioClient.removeObjects(bucketName, fileNames);
    } catch (err) {
      this.logger.error('Could not delete the objects', err.stack);
      throw new InternalServerErrorException('Objects removal failed');
    }
  }
}
