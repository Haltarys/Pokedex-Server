import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from './chat-message.schema';
import type { ChatMessageDto } from './dto/chat-message.dto';
import type { ChatMessageQuery } from './dto/chat-message.query';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  async findAll({
    chatroomId,
    authorId,
  }: ChatMessageQuery): Promise<ChatMessageDocument[]> {
    return this.chatMessageModel
      .find({ chatroom: chatroomId, author: authorId })
      .sort('createdAt')
      .exec();
  }

  async findOne(id: string): Promise<ChatMessageDocument | null> {
    return this.chatMessageModel.findById(id).exec();
  }

  async create(
    chatMessageDto: ChatMessageDto,
    authorId: string,
    chatroomId: string,
  ): Promise<ChatMessageDocument> {
    const chatMessage = new this.chatMessageModel({
      ...chatMessageDto,
      author: authorId,
      chatroom: chatroomId,
    });

    return chatMessage.save();
  }

  async update(
    id: string,
    chatMessageDto: ChatMessageDto,
  ): Promise<ChatMessageDocument | null> {
    return this.chatMessageModel
      .findByIdAndUpdate(id, chatMessageDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    return this.chatMessageModel
      .findByIdAndDelete(id)
      .exec()
      .then((chatMessage) => !!chatMessage);
  }

  async isAuthor(chatMessageId: string, userId: string): Promise<boolean> {
    return this.chatMessageModel
      .exists({ _id: chatMessageId, author: userId })
      .exec()
      .then((chatMessage) => !!chatMessage);
  }
}
