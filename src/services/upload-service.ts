import { Service } from 'typedi';
import { v2 as cloudinary } from 'cloudinary';
import { ReadStream } from 'fs';

import Env from '~/config/Env';

export interface Upload {
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
}

@Service()
export default class UploadService {
  private uploader: typeof cloudinary;

  constructor(
    private readonly configService: Env,
  ) {
    this.uploader = cloudinary;

    this.uploaderConfig();
  }

  private uploaderConfig() {
    const { cloud_name, api_secret, api_key } = this.configService.getCloudinaryConfig;
    this.uploader.config({
      cloud_name,
      api_key,
      api_secret,
    });
  }

  public async upload(stream: ReadStream): Promise<Upload> {
    return await new Promise(async (resolve, reject) => {

      const streamload = await this.uploader.uploader.upload_stream('', (error, result) => {
        resolve(result);
      });

      stream
        .on('error', error => {
          console.log(error);
          reject(error);
        })
        .pipe(
          streamload,
        );
    });
  }
}
