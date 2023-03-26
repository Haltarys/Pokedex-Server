import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import type { User } from 'src/user/user.schema';

@Schema({ versionKey: false, toJSON: { virtuals: true } })
export class Chatroom {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
    default: [],
  })
  members: User[];
}

export type ChatroomDocument = HydratedDocument<Chatroom>;

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
