import { Controller, Get, Param, Post } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import { UsersService } from 'src/services/users.service';

@Controller('/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users')
  async getAll(): Promise<Users[]> {
    return await this.usersService.getAllUsers();
  }

  @Get('/user/:id')
  async getUser(@Param('id') id: string): Promise<Users> {
    return await this.usersService.getIdUser(id);
  }

//   @Post('/new-user')
}
