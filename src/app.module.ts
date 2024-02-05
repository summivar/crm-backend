import { Module } from '@nestjs/common';
import { join } from 'path';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.HOST'),
        port: configService.get('database.PORT'),
        username: configService.get('database.USERNAME'),
        password: configService.get('database.PASSWORD'),
        database: configService.get('database.NAME'),
        synchronize: true,
        entities: [
          __dirname + '/**/*.entity{.js, .ts}'
        ]
      }),
      inject: [ConfigService]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      exclude: ['/api/(.*)'],
      serveRoot: '/uploads',
    }),
    CommonModule,
  ],
})
export class AppModule {
}
