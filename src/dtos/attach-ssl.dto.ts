export interface AttachSSLDto {
  hostname: string;
  key: Buffer | string;
  cert: Buffer | string;
  ca?: Buffer | string;
}
