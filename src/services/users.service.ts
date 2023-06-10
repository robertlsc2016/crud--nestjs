import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { users } from 'src/database/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(users.name) private usersModel: Model<users>) {}

  async getAllUsers(): Promise<users[]> {
    return this.usersModel.find();
  }

  async getIdUser(id: string): Promise<users> {
    return this.usersModel.findOne({ _id: id });
  }
}
