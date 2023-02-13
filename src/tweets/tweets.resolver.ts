import { UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver , Query, Args, Mutation, Root, Context, ResolveField } from '@nestjs/graphql';
import { CurrentUser } from 'src/Decorators/currentUser.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { tweetEntity } from '../Models/tweet.entity';
import { TweetService } from './tweets.services';
import { TweetInput } from 'src/DTOs/Tweet/AddTweetDTO';
import { TransactionInterceptor } from 'src/Interceptors/Transaction.Interceptor';
import { TransactionParam } from 'src/Decorators/TransactionParam.decorator';
import { Transaction } from 'sequelize';
import { MyContext } from 'src/Models/MyContext';
import { FetchTweetArgs } from 'src/Models/FetchTweetArgs';
import { ResponseInterceptor } from 'src/Interceptors/ResponseInterceptor';
import {  MutationResponse, SingleTweetResponse, TweetResponse } from 'src/Models/Response.Model';



@Resolver(of=>tweetEntity)

export class TweetsResolver {
       
    constructor(private readonly tweetService:TweetService){
    
    }
    @UseInterceptors(ResponseInterceptor<[tweetEntity]>)    
    @Query(()=>TweetResponse<[tweetEntity]>)
    async Tweets(@Args() args: FetchTweetArgs){
        
        return this.tweetService.Tweets(args)
    }
    @UseInterceptors(ResponseInterceptor<tweetEntity>)    
    @Query(() => SingleTweetResponse , {name:"tweet"})
    async FindOneTweet(@Args({name:'id', type:()=>String}) id:string){
        return this.tweetService.FindOneTweet(id);
    }

    @UsePipes(ValidationPipe)
    @UseInterceptors(ResponseInterceptor<String>)
    @UseGuards(AuthGuard)
    @Mutation(()=>MutationResponse)
    @UseInterceptors(TransactionInterceptor)

    async AddTweet(@TransactionParam() transaction:Transaction ,@CurrentUser() user, @Args('data') input: TweetInput){
    const userId = user.sub 
    await this.tweetService.addTweet(input , userId , transaction)
    return "Created"
    }
    @UseInterceptors(ResponseInterceptor<String>)
    @UseGuards(AuthGuard)
    @Mutation(()=>MutationResponse)
    async RemoveTweet(@CurrentUser() user, @Args({name:'id' , type:()=>String}) id:string){
        return this.tweetService.removeTweet(id , user.sub)
        


    }
    @UseGuards(AuthGuard)
    @UseInterceptors(ResponseInterceptor<String>)
    @UseInterceptors(TransactionInterceptor)
    @Mutation( ()=>MutationResponse , {name:"like"})
    async addOrRemoveLike(@TransactionParam() transaction:Transaction, @CurrentUser() user, @Args({name:'PostId', type:()=>String})PostId:string){
       
        return await this.tweetService.addOrRemoveLike(PostId , user.sub , transaction)
    }

    @ResolveField('user')
    async user(
    @Context()ctx:MyContext,
    @Root() tweet: tweetEntity,
    
  ){
    
    return await ctx.Userloader.load(tweet.id);
  }
}



