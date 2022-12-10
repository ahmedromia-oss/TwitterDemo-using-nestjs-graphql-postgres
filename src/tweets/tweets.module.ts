import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { tweetEntity } from './tweet.entity';
import { TweetsResolver } from './tweets.resolver';
import { TweetService } from './tweets.services';



@Module({
  providers: [TweetsResolver , TweetService],
  imports:[TypeOrmModule.forFeature([ tweetEntity ]),
  forwardRef(() => UsersModule),
  JwtModule.register({
    secret: 'secretKey',
    signOptions: { expiresIn: '60s' },
  })
  

],
exports:[TweetService]
  
  
  
})
export class TweetsModule {}
