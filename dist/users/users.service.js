"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(email, isActive) {
        const where = {};
        if (email) {
            where.email = email;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
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
            throw new common_2.NotFoundException('User not found');
        }
        return users;
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
        if (!user)
            throw new common_2.NotFoundException('User not found');
        return user;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_2.NotFoundException('Email already exists');
        }
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
    async update(id, updateUserDto) {
        await this.findOne(id);
        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
            updateUserDto.password = hashedPassword;
        }
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
    async delete(id) {
        await this.findOne(id);
        await this.prisma.user.delete({
            where: { id },
        });
        return { id };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map