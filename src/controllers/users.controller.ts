import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { UsersService } from 'src/services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';

import { fs } from 'memfs';

import { Express } from 'express';
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
  async getAll(): Promise<UsersEntity[]> {
    return await this.usersService.getAllUsers();
  }

  @Get('/user/:id')
  @ApiOperation({ summary: 'Get user by id' })
  async getUser(@Param('id') id: string): Promise<UsersEntity> {
    return await this.usersService.getIdUser(id);
  }

  @Post('/new-user')
  @ApiOperation({ summary: 'Create a user' })
  async createNewUser(@Body() user: CreateUserDto): Promise<UsersEntity> {
    return await this.usersService.createUser(user);
  }

  @Patch('/update-user/:id')
  @ApiOperation({ summary: 'Update a user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UsersEntity> {
    return await this.usersService.updateUser(id, updateUser);
  }

  @Delete('/delete-user/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException('O Arquivo não é .CSV');
    }

    fs.writeFileSync('/file.csv', file.buffer.toString());
    await this.usersService.processCsv(file.buffer);
  }

  @Get('/pagination/page=:numberPage')
  async getUsers(@Param('numberPage') numberPage: number) {
    const users = await this.usersService.getPaginatedUsers(numberPage, 15);
    return users;
  }
}
