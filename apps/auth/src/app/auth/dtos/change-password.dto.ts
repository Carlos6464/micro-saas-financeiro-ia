import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  newPassword!: string;
}