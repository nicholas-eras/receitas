// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryService {
  async uploadMany(files: Express.Multer.File[]): Promise<string[]> {
    const results = await Promise.all(
      files.map((file) =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'receitas', public_id: uuid() },
            (error, result) => {
              if (error) return reject(error);
              resolve(result!.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      )
    );
    return results;
  }

  async deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
  }
}
