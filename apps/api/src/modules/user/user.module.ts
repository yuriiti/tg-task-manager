import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { UserRepository } from './infrastructure/persistence/mongodb/user.repository';
import { User, UserSchema } from './infrastructure/persistence/mongodb/user.schema';
import { USER_REPOSITORY_TOKEN } from './domain/interfaces/user.repository.token';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
