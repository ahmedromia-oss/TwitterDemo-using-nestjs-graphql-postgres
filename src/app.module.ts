import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TweetsModule } from './tweets/tweets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tweetEntity } from './tweets/tweet.entity';

import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';

import { JwtModule } from '@nestjs/jwt';
@Module({
  providers:[],
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>(
    {
      
      driver:ApolloDriver,
      autoSchemaFile: true,
      sortSchema:true,
      
    }

  ),
  JwtModule.register({
    secret: 'secretKey',
    signOptions: { expiresIn: '60s' },
  }),

  TweetsModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'root123',
    database: 'twitterDemo',
    entities:[tweetEntity , User],
    autoLoadEntities:true,
    synchronize: true,
    
  }),
  UsersModule,
],
 
  
})
export class AppModule {}
