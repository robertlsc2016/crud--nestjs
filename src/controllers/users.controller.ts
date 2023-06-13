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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Users } from 'src/entities/users.entity';
import { UsersService } from 'src/services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

// const { createFsFromVolume, Volume } = require('memfs');
// const fs = createFsFromVolume(new Volume());
import { fs } from 'memfs';

import { Express } from 'express';
import multer, { memoryStorage } from 'multer';
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

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    fs.writeFileSync('/file.csv', file.buffer.toString());
    await this.usersService.processCsv(file.buffer);
  }
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   // console.log(file);
  //   fs.writeFileSync('/file.csv', file.buffer.toString());
  //   // console.log(fs.readFileSync('/file.csv', 'utf8').toString());
  //   const stringCsv = fs.readFileSync('/file.csv', 'utf8').toString();
  //   const dataList = [];
  //   const readableStream = Readable.from(stringCsv)
  //     .pipe(csv())
  //     .on('data', (row) => {
  //       dataList.push(row);
  //     })
  //     .on('end', () => {
  //       for (const data of dataList) {
  //         if (data.nome.trim() === '' || !isValidEmail(data.email)) {
  //           throw new HttpException(
  //             'Elementos inválidos no arquivo CSV',
  //             HttpStatus.BAD_REQUEST,
  //           );
  //         }
  //       }

  //       // Restante do processamento do arquivo CSV
  //       console.log(dataList);
  //     });
  // }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
