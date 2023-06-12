import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Users } from 'src/entities/users.entity';
import { UsersService } from 'src/services/users.service';

@ApiTags('Users')
@Controller('/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async helloWorld() {
    return {
      message: 'Hello world',
    };
  }

  @Get('/users')
  @ApiOperation({ summary: 'Get All Users' })
  async getAll(): Promise<Users[]> {
    return await this.usersService.getAllUsers();
  }

  @Get('/user/:id')
  @ApiOperation({ summary: 'Get user by id' })
  async getUser(@Param('id') id: string): Promise<Users> {
    return await this.usersService.getIdUser(id);
  }

  @Post('/new-user')
  @ApiOperation({ summary: 'Create a user' })
  async createNewUser(@Body() user: CreateUserDto): Promise<Users> {
    return await this.usersService.createUser(user);
  }

  @Patch('/update-user/:id')
  @ApiOperation({ summary: 'Update a user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<Users> {
    return await this.usersService.updateUser(id, updateUser);
  }

  @Delete('/delete-user/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
