import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/database/schemas/users.schema';
import { UsersController } from 'src/controllers/users.controller';
import { UsersService } from 'src/services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [],
})
export class UsersServiceModule {}
