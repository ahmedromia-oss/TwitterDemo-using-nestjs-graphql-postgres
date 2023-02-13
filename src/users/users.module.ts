import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from '../Models/users.entity';
import { TweetsModule } from 'src/tweets/tweets.module';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { FollowerFollowing } from 'src/Models/FollowerFollowing.Model';
import { TransactionInterceptor } from 'src/Interceptors/Transaction.Interceptor';


@Module({
  providers: [UsersService,
     UsersResolver,
     TransactionInterceptor,
    
  ],
  imports:[SequelizeModule.forFeature([User , FollowerFollowing]),
  forwardRef(() => TweetsModule),
  forwardRef(() => AuthModule),
],
exports:[UsersService]

  
})
export class UsersModule {}
