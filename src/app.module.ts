import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { TweetsModule } from './tweets/tweets.module';

import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import {  generateUserDataLoader } from './loaders/UserDataLoader';


@Module({
  
  providers:[ 
    

    

   ],
   
  imports: [GraphQLModule.forRoot(
    {
      uploads: false,

      context: () => ({
       
        Userloader:generateUserDataLoader()
        
      
      }),
      driver:ApolloDriver,
      autoSchemaFile: true,
      sortSchema:true,
      
    }

  ),
 

  TweetsModule,
  UsersModule,
  AuthModule,
  
  SequelizeModule.forRoot({
    dialect: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'root123',
    database: 'twitterDemo',
    autoLoadModels: true,
    synchronize: true
  }),
],
 
})
export class AppModule {
  
}
