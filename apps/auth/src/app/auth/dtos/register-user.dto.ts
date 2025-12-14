import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  @MaxLength(45)
  name!: string;

  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Formato de email inválido' })
  @MaxLength(100)
  email!: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password!: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @IsString()
  @MaxLength(15)
  telefone!: string; // Obrigatório conforme seu requisito inicial
}