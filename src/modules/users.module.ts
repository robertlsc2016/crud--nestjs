import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { users, UsersSchema } from 'src/database/schemas/users.schema';
import { UsersController } from 'src/controllers/users/users.controller';
import { UsersService } from 'src/services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: users.name,
        schema: UsersSchema,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [],
})
export class UsersServiceModule {}
