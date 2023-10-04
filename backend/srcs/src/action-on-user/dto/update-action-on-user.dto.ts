import { PartialType } from '@nestjs/swagger';
import { CreateActionOnUserDto } from './create-action-on-user.dto';

export class UpdateActionOnUserDto extends PartialType(CreateActionOnUserDto) {}
