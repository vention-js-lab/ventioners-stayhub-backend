import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class AccommodationImagesValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/tiff',
  ];

  private readonly maxFileSize = 10 * 1024 * 1024;

  transform(files: Express.Multer.File[]) {
    if (!files || files.length < 5) {
      throw new BadRequestException('Minimum 5 images required.');
    }

    if (files.length > 15) {
      throw new BadRequestException('Maximum 15 images allowed.');
    }

    files.forEach((file) => {
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type for ${file.originalname}. Only image files are allowed.`,
        );
      }

      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds the maximum allowed size of 10 MB.`,
        );
      }
    });

    return files;
  }
}
