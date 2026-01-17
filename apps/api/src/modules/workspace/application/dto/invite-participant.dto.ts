import { IsString, IsNotEmpty } from 'class-validator';

export class InviteParticipantDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
