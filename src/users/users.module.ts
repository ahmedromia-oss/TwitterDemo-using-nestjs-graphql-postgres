import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { TweetsModule } from 'src/tweets/tweets.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  providers: [UsersService, UsersResolver],
  imports:[TypeOrmModule.forFeature([User]),
  forwardRef(() => TweetsModule),
  JwtModule.register({
    secret: 'secretKey',
    signOptions: { expiresIn: '10h' },
  })


],
exports:[UsersService]

  
})
export class UsersModule {}
