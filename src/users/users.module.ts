import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { TweetsModule } from 'src/tweets/tweets.module';

@Module({
  providers: [UsersService, UsersResolver],
  imports:[TypeOrmModule.forFeature([User]),
  forwardRef(() => TweetsModule),

],
exports:[UsersService]

  
})
export class UsersModule {}
