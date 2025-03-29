import { IsEmail, IsEnum, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'email should not be empty!!' })
  email: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'isActive should not be empty!!' })
  isActive: boolean;

  @IsEnum(['ADMIN', 'USER'], { message: 'valid role required' })
  role: 'ADMIN' | 'USER';
}
