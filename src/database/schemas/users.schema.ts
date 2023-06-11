import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Users extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
