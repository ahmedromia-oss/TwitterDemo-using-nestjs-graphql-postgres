import {UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Query ,Args, Resolver, Mutation, Int } from '@nestjs/graphql';
import { CurrentUser } from '../Decorators/currentUser.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { User} from '../Models/users.entity';
import { UsersService } from './users.service';
import { UserLoginDTO } from '../DTOs/User/UserLogin.DTO';


import { UserInput } from 'src/DTOs/User/UserRegisterDto';
import { TransactionInterceptor } from 'src/Interceptors/Transaction.Interceptor';
import { Transaction } from 'sequelize';
import { TransactionParam } from 'src/Decorators/TransactionParam.decorator';

import GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
import FileUpload = require('graphql-upload/GraphQLUpload.js');
import { ResponseInterceptor } from 'src/Interceptors/ResponseInterceptor';
import {  MutationResponse, UserResponse } from 'src/Models/Response.Model';






@Resolver(of=>(User))

export class UsersResolver {
    constructor(private readonly UserService:UsersService){}
    
    @UseInterceptors(TransactionInterceptor)
    @UsePipes(ValidationPipe)
    @Mutation(()=>MutationResponse)

    SignIn(@TransactionParam() transaction: Transaction, @Args('data') input: UserInput){
        
        return this.UserService.SignIn(input , transaction)
    }
    @UsePipes(ValidationPipe)
    @Mutation(()=>MutationResponse)
    async Login(@Args('data') user: UserLoginDTO){
        var token =await this.UserService.login(await this.UserService.Validate( user.Email, user.password))
        if(token == "Bad Login Attempt"){
            return new MutationResponse(400 , token)

        }
        else{
            return new MutationResponse(200 , token)

        }
        
    

    }
    @UseInterceptors(ResponseInterceptor<User>)
    @UseGuards(AuthGuard)
    @Query(() => UserResponse<User>)

    async Profile(@CurrentUser() user){
        
        return this.UserService.Profile(user.sub);
    }
    @UseInterceptors(TransactionInterceptor)
    @UseGuards(AuthGuard)
    @Mutation(()=>MutationResponse , {name:"follow"})
    @UseInterceptors(ResponseInterceptor<String>)
    async addOrRemoveFollow(@TransactionParam() transaction:Transaction ,@CurrentUser() user, @Args({name:'followingId', type:()=>String})followingId:string){
       
        return await this.UserService.addOrRemoveFollow(user.sub , followingId , transaction)
    }
    @UseInterceptors(ResponseInterceptor)
    @UseInterceptors(TransactionInterceptor)
    
    @UseGuards(AuthGuard)
    @Mutation(() => MutationResponse)
    async uploadProfilePhoto(
      @TransactionParam() transaction:Transaction ,@CurrentUser() user, @Args({name: 'file', type: () => GraphQLUpload}) {createReadStream , filename , mimetype}: FileUpload): Promise<String> {
        const result = await this.UserService.UpdateProfilePhoto({createReadStream , filename , mimetype} , user.sub , transaction)
        
        if(result){
            return "Created"
        }
        else{
            return "Bad Request"
        }
       
        
    }
    @UseInterceptors(ResponseInterceptor)
    @UseInterceptors(TransactionInterceptor)
    @UseGuards(AuthGuard)
    @Mutation(() => MutationResponse)
    async uploadCoverPhoto(@TransactionParam() transaction:Transaction ,@CurrentUser() user, @Args({name: 'file', type: () => GraphQLUpload}){createReadStream,filename , mimetype}: FileUpload): Promise<String> {
     
        const result =  await this.UserService.UpdateCoverPhoto({createReadStream , filename , mimetype} , user.sub , transaction)
        if(result){
            return "Created"
        }
        else{
            return "Bad Request"
        }
       
        
    }
}