import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { JwtModule } from '@nestjs/jwt';
//import { config } from 'rxjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        username: config.get<string>('DB_USERNAME'),
        port: config.get<number>('DB_PORT'),
        host: config.get<string>('DB_HOST'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [User],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE', false),
      }),
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
