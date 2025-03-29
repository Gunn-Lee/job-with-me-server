import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  // Dummy DB
  private users = [
    { id: 1, email: 'John@some.mail', role: 'ADMIN', isActive: true },
  ];

  findAll(
    email?: string,
    isActive?: boolean,
  ): { id: number; email: string; role: string; isActive: boolean }[] {
    let user: { id: number; email: string; role: string; isActive: boolean }[] =
      [];
    if (email) {
      user = this.users.filter((user) => user.email === email);
    }
    if (email && isActive) {
      if (user.length === 0) throw new NotFoundException('User not found');
      else
        return user as {
          id: number;
          email: string;
          role: string;
          isActive: boolean;
        }[];
    }
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new NotFoundException('User not found');
    return;
  }

  create(createUserDto: CreateUserDto) {
    const newUserId = [...this.users].sort((a, b) => b.id - a.id)[0].id + 1;
    const newUser = { id: newUserId, ...createUserDto };
    this.users.push(newUser);

    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ...updateUserDto } : user,
    );

    return this.findOne(id);
  }

  delete(id: number) {
    this.users = this.users.filter((user) => user.id !== id);

    return { id };
  }
}
