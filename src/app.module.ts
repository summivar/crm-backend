import { Module } from '@nestjs/common';
import { join } from 'path';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualClientModule } from './client/individual-client/individual-client.module';
import { CorporateClientModule } from './client/corporate-client/corporate-client.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { StatusModule } from './status/status.module';
import { PaymentMethodModule } from './paymentMethod/paymentMethod.module';
import { SolutionModule } from './solution/solution.module';
import { OrderModule } from './order/order.module';

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
        autoLoadEntities: true,
        entities: [
          __dirname + '/**/*.entity{.js, .ts}'
        ],
      }),
      inject: [ConfigService]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      exclude: ['/api/(.*)'],
      serveRoot: '/uploads',
    }),
    CommonModule,
    IndividualClientModule,
    CorporateClientModule,
    AuthModule,
    UserModule,
    CompanyModule,
    StatusModule,
    PaymentMethodModule,
    SolutionModule,
    OrderModule
  ],
})
export class AppModule {
}
