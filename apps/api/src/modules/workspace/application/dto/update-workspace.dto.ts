import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateWorkspaceDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  name?: string;
}
