import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersServiceModule } from './modules/users.module';
import { UsersSchema, Users } from './database/schemas/users.schema';
import { DataBaseConnection } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DataBaseConnection,
    UsersServiceModule,
    ConfigModule.forRoot({
      // envFilePath: './env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
