import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/database/schemas/users.schema';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Readable } from 'stream';
import * as csv from 'csv-parser';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  async getAllUsers(): Promise<Users[]> {
    return this.usersModel.find();
  }

  async getIdUser(id: string): Promise<Users> {
    return this.usersModel.findOne({ _id: id });
  }

  async createUser(createUser: CreateUserDto): Promise<Users> {
    return this.usersModel.create(createUser);
  }

  async updateUser(id: string, updateUser: UpdateUserDto): Promise<Users> {
    const user = await this.usersModel.findByIdAndUpdate(id, updateUser, {
      new: true,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async deleteUser(id: string): Promise<Users> {
    const user = await this.usersModel.findByIdAndDelete(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async processCsv(fileBuffer: Buffer) {
    
    const stringCsv = fileBuffer.toString();
    const dataList: CsvData[] = [];

    console.log(stringCsv)

    await new Promise<void>((resolve, reject) => {
      Readable.from(stringCsv)
        .pipe(csv())
        .on('data', (row) => {
          dataList.push(row);
        })
        .on('end', () => {
          for (const data of dataList) {
            if (data.name.trim() === '' || !this.isValidEmail(data.email)) {
              reject(
                new HttpException(
                  'Elementos inválidos no arquivo CSV',
                  HttpStatus.BAD_REQUEST,
                ),
              );
            }
          }
          this.usersModel.insertMany(dataList);
          resolve();
        });
    });
  }

  async getPaginatedUsers(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const users = await this.usersModel
      .find()
      .skip(skip)
      .limit(pageSize)
      .exec();

    return users;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

interface CsvData {
  name: string;
  email: string;
}
