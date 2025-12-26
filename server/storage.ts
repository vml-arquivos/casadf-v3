// S3 storage adapter for production deployment
// Supports AWS S3, MinIO, and S3-compatible services

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

type StorageConfig = {
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
};

function getStorageConfig(): StorageConfig {
  const bucket = ENV.storageBucket;
  const region = ENV.storageRegion;
  const endpoint = ENV.storageEndpoint;
  const accessKeyId = ENV.storageAccessKey;
  const secretAccessKey = ENV.storageSecretKey;

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 storage credentials missing: set STORAGE_BUCKET, STORAGE_REGION, STORAGE_ACCESS_KEY, and STORAGE_SECRET_KEY"
    );
  }

  return { bucket, region, endpoint, accessKeyId, secretAccessKey };
}

function getS3Client(): S3Client {
  const config = getStorageConfig();
  
  const s3Config: any = {
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  };

  // Support for S3-compatible services (MinIO, etc)
  if (config.endpoint) {
    s3Config.endpoint = config.endpoint;
    s3Config.forcePathStyle = true;
  }

  return new S3Client(s3Config);
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const config = getStorageConfig();
  const key = normalizeKey(relKey);
  const client = getS3Client();

  try {
    const buffer = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);

    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await client.send(command);

    // Generate signed URL (valid for 7 days)
    const getCommand = new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });

    const url = await getSignedUrl(client, getCommand, { expiresIn: 604800 });

    return { key, url };
  } catch (error) {
    throw new Error(
      `S3 upload failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const config = getStorageConfig();
  const key = normalizeKey(relKey);
  const client = getS3Client();

  try {
    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });

    // Generate signed URL (valid for 7 days)
    const url = await getSignedUrl(client, command, { expiresIn: 604800 });

    return { key, url };
  } catch (error) {
    throw new Error(
      `S3 get URL failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
