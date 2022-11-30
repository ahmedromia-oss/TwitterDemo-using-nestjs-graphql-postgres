import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { tweetEntity } from './tweet.entity';
import { TweetsResolver } from './tweets.resolver';
import { TweetService } from './tweets.services';



@Module({
  providers: [TweetsResolver , TweetService],
  imports:[TypeOrmModule.forFeature([ tweetEntity ]),
  forwardRef(() => UsersModule),

]
  
  
  
})
export class TweetsModule {}
