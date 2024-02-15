import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { CompanyModule } from '../company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Confirm } from './entities/confirm.entity';

@Global()
@Module({
  imports: [
    // TypeOrmModule.forFeature([
    //   Confirm
    // ]),
    UserModule,
    CompanyModule,
    JwtModule.register({}),
    CommonModule
  ],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {
}
