import { Injectable, Logger } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    HeadBucketCommand,
    CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
    private readonly client: S3Client;
    private readonly bucket: string;
    private readonly endpoint: string;
    private readonly logger = new Logger(S3Service.name);

    constructor() {
        // prefer internal endpoint for docker-compose networking
        const endpoint = process.env.S3_ENDPOINT_INTERNAL || process.env.S3_ENDPOINT;
        this.endpoint = endpoint?.replace(/\/$/, '') ?? '';
        this.bucket = process.env.S3_BUCKET ?? '';
        if (!this.bucket) {
            throw new Error('S3_BUCKET environment variable is required');
        }
        const region = process.env.S3_REGION || 'us-east-1';
        const forcePathStyle = (process.env.S3_FORCE_PATH_STYLE ?? 'true') === 'true';

        this.client = new S3Client({
            endpoint: this.endpoint || undefined,
            region,
            forcePathStyle,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
        });

        this.logger.log(`S3Service initialized (endpoint=${this.endpoint}, bucket=${this.bucket}, region=${region})`);

        // Ensure bucket exists (async, fire-and-forget)
        this.ensureBucketExists().catch((err) => {
            this.logger.error('Failed to ensure S3 bucket exists', err);
        });
    }

    private async ensureBucketExists() {
        try {
            await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
            this.logger.log(`S3 bucket "${this.bucket}" already exists`);
            return;
        } catch (err: any) {
            // If bucket not found, create it. For S3 the error may be NotFound / NotFound or 404
            const notFound =
                err?.name === 'NotFound' ||
                err?.name === 'NoSuchBucket' ||
                err?.$metadata?.httpStatusCode === 404;
            if (!notFound) {
                // unexpected error
                throw err;
            }
            this.logger.log(`S3 bucket "${this.bucket}" does not exist, creating...`);
            try {
                // CreateBucketConfiguration is ignored by MinIO but required for some AWS regions
                const params: any = { Bucket: this.bucket };
                if ((process.env.S3_REGION || 'us-east-1') !== 'us-east-1') {
                    params.CreateBucketConfiguration = { LocationConstraint: process.env.S3_REGION };
                }
                await this.client.send(new CreateBucketCommand(params));
                this.logger.log(`S3 bucket "${this.bucket}" created`);
            } catch (createErr) {
                // If bucket already created by concurrent process, ignore that specific error
                const alreadyExists =
                    (createErr as any)?.name === 'BucketAlreadyOwnedByYou' ||
                    (createErr as any)?.name === 'BucketAlreadyExists';
                if (alreadyExists) {
                    this.logger.log(`S3 bucket "${this.bucket}" already exists (concurrent)`);
                    return;
                }
                throw createErr;
            }
        }
    }

    async uploadFile(buffer: Buffer, key: string, contentType?: string) {
        const cmd = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        });
        await this.client.send(cmd);
        const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT || this.endpoint;
        const url = publicEndpoint ? `${publicEndpoint.replace(/\/$/, '')}/${this.bucket}/${encodeURIComponent(key)}` : key;
        return { key, url };
    }

    async getObject(key: string) {
        const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
        const res = await this.client.send(cmd);
        const buffer = await this.streamToBuffer(res.Body);
        return {
            key,
            buffer,
            contentType: res.ContentType,
            metadata: res.Metadata,
        };
    }

    async deleteObject(key: string) {
        const cmd = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
        await this.client.send(cmd);
        return { key, deleted: true };
    }

    async listObjects(prefix?: string) {
        const cmd = new ListObjectsV2Command({ Bucket: this.bucket, Prefix: prefix });
        const res = await this.client.send(cmd);
        const items = (res.Contents || []).map(i => ({
            key: i.Key,
            size: i.Size,
            lastModified: i.LastModified,
            etag: i.ETag,
        }));
        return items;
    }

    private async streamToBuffer(stream: any): Promise<Buffer> {
        if (!stream) return Buffer.alloc(0);
        if (Buffer.isBuffer(stream)) return stream;
        // Response.Body can be a Readable stream in Node
        if (typeof (stream as any).pipe === 'function') {
            return new Promise((resolve, reject) => {
                const chunks: Buffer[] = [];
                (stream as Readable)
                    .on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
                    .on('error', reject)
                    .on('end', () => resolve(Buffer.concat(chunks)));
            });
        }
        // Fallback for other types (string/Uint8Array)
        if (typeof stream === 'string') return Buffer.from(stream);
        if (stream instanceof Uint8Array) return Buffer.from(stream);
        return Buffer.alloc(0);
    }
}
