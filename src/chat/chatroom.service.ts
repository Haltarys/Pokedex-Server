import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chatroom, ChatroomDocument } from './chatroom.schema';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private chatroomModel: Model<ChatroomDocument>,
  ) {}

  async findAll(): Promise<ChatroomDocument[]> {
    return this.chatroomModel.find().exec();
  }

  async findOne(id: string): Promise<ChatroomDocument | null> {
    return this.chatroomModel.findById(id).exec();
  }

  async findJoinedChatrooms(userId: string): Promise<ChatroomDocument[]> {
    return this.chatroomModel.find({ members: userId }).exec();
  }

  async create(
    createChatroomDto: CreateChatroomDto,
  ): Promise<ChatroomDocument> {
    const chatroom = new this.chatroomModel(createChatroomDto);

    return chatroom.save();
  }

  async update(
    id: string,
    updateChatroomDto: UpdateChatroomDto,
  ): Promise<ChatroomDocument | null> {
    return this.chatroomModel
      .findByIdAndUpdate(id, updateChatroomDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    return this.chatroomModel
      .findByIdAndDelete(id)
      .exec()
      .then((chatroom) => !!chatroom);
  }

  async addUser(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomDocument | null> {
    return this.chatroomModel
      .findByIdAndUpdate(
        chatroomId,
        { $addToSet: { members: userId } },
        { new: true },
      )
      .exec();
  }

  async removeUser(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomDocument | null> {
    return this.chatroomModel
      .findByIdAndUpdate(
        chatroomId,
        { $pull: { members: userId } },
        { new: true },
      )
      .exec();
  }

  async isMember(chatroomId: string, userId: string): Promise<boolean> {
    return this.chatroomModel
      .exists({ _id: chatroomId, members: userId })
      .exec()
      .then((chatroom) => !!chatroom);
  }
}
