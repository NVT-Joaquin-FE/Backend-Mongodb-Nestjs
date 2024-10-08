import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

import mongoose, { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) {}

  getHasPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  async create(createUserDto: CreateUserDto) {
    // return createUserDto;
    const hashPassword = this.getHasPassword(createUserDto.password);
    const users = await this.UserModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
    });
    return users;
  }

  // async create(email: string, password: string, name: string) {
  //   const hashPassword = this.getHasPassword(password);
  //   const users = await this.UserModel.create({
  //     email,
  //     password: hashPassword,
  //     name,
  //   });
  //   return users;
  // }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';

    return this.UserModel.findOne({
      _id: id,
    });
  }

  findOneByUserName(userName: string) {
    return this.UserModel.findOne({
      email: userName,
    });
  }

  isValidPassword(hash: string, password: string) {
    return compareSync(password, hash); // false
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.UserModel.deleteOne({
      _id: id,
    });
  }
}
