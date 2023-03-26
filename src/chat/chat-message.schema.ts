import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import type { User } from 'src/user/user.schema';
import type { Chatroom } from './chatroom.schema';

@Schema({ versionKey: false, toJSON: { virtuals: true }, timestamps: true })
export class ChatMessage {
  @Prop({ required: true })
  body: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ type: Types.ObjectId, ref: 'Chatroom', required: true })
  chatroom: Chatroom;
}

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
