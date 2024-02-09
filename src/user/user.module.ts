import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonModule } from '../common/common.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    CompanyModule,
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
}
