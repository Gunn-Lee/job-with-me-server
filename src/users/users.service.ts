import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  async findAll(email?: string, isActive?: boolean) {
    // Build where conditions based on provided filters
    const where: any = {};

    if (email) {
      where.email = email;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Fetch users from database with prisma
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (email && isActive && users.length === 0) {
      throw new NotFoundException("User not found");
    }

    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    // Check if the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new NotFoundException("Email already exists");
    }
    // Create the user
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // First check if the user exists
    await this.findOne(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
      updateUserDto.password = hashedPassword;
    }

    // Then update the user
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  async delete(id: number) {
    // First check if the user exists
    await this.findOne(id);

    // Then delete the user
    await this.prisma.user.delete({
      where: { id },
    });

    return { id };
  }
}
