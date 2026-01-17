import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { TmaAuthGuard } from './modules/auth/presentation/guards/tma-auth.guard';
import { ResponseValidationInterceptor } from './common/interceptors';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const config = databaseConfig();
        console.log('Connecting to MongoDB:', config.uri.replace(/:[^:@]+@/, ':****@'));
        return {
          uri: config.uri,
          retryWrites: true,
          w: 'majority',
        };
      },
    }),
    SharedModule,
    UserModule,
    TaskModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TmaAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseValidationInterceptor,
    },
  ],
})
export class AppModule {}
