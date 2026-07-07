import { PartialType } from '@nestjs/swagger';
import { CreateBeneficiaryDto } from './create-beneficiary.dto.js';

export class UpdateBeneficiaryDto extends PartialType(CreateBeneficiaryDto) {}
