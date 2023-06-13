import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/database/schemas/users.schema';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Readable } from 'stream';
import * as csv from 'csv-parser';

// import { UpdateUserDto } from 'src/dtos/update-user.dto';

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

    await new Promise<void>((resolve, reject) => {
      Readable.from(stringCsv)
        .pipe(csv())
        .on('data', (row) => {
          dataList.push(row);
        })
        .on('end', () => {
          for (const data of dataList) {
            console.log(this.isValidEmail(data.email));
            if (data.name.trim() === '' || !this.isValidEmail(data.email)) {
              reject(
                new HttpException(
                  'Elementos inválidos no arquivo CSV',
                  HttpStatus.BAD_REQUEST,
                ),
              );

              // return { error: 'Os dados possuem incompatibilidades' };
            }
          }
          this.usersModel.insertMany(dataList);
          resolve();
        });
    });
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
