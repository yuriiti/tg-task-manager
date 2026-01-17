import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto, UserResponseDto } from '../../application/dto';
import { UserEntity } from '../../domain/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create({
      id: createUserDto.id,
      username: createUserDto.username,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      languageCode: createUserDto.languageCode,
      isPremium: createUserDto.isPremium,
      photoUrl: createUserDto.photoUrl,
    });
    return this.toResponseDto(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return this.toResponseDto(user);
  }

  private toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      isActive: user.isActive,
      firstName: user.firstName,
      lastName: user.lastName,
      languageCode: user.languageCode,
      isPremium: user.isPremium,
      photoUrl: user.photoUrl,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
