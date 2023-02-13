import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

import { UserLikes } from 'src/Models/UserLikes.Model';
import { UsersModule } from 'src/users/users.module';
import { tweetEntity } from '../Models/tweet.entity';
import { TweetsResolver } from './tweets.resolver';
import { TweetService } from './tweets.services';



@Module({
  providers: [TweetsResolver , TweetService],
  imports:[SequelizeModule.forFeature([ tweetEntity  , UserLikes]),
  forwardRef(() => UsersModule),
  forwardRef(() => AuthModule),
],
exports:[TweetService]
  
  
  
})
export class TweetsModule {}
