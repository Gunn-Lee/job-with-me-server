import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect(); // Connect to the database when the module is initialized
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect from the database when the module is destroyed
  }
}
