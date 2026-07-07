export class CreateDeviceDto {
  userId: string;
  name: string;
  fingerprint: string;
  status?: 'PENDING' | 'TRUSTED' | 'REVOKED';
  metadata?: Record<string, unknown>;
}
