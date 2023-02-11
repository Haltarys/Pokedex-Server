import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ versionKey: false })
export class User {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  password: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
