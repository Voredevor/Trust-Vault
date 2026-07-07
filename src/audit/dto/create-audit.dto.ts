export class CreateAuditDto {
  userId?: string;
  actorType?: 'USER' | 'SYSTEM' | 'ADMIN';
  action: string;
  resourceType: string;
  resourceId?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
