import { PartialType } from '@nestjs/swagger';
import { CreateAuditDto } from './create-audit.dto.js';

export class UpdateAuditDto extends PartialType(CreateAuditDto) {}
