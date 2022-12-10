import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver , Query, Args, Int, Mutation } from '@nestjs/graphql';
import { type } from 'os';
import { CurrentUser } from 'src/users/decerators/currentUser.decerator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { tweetEntity , TweetInput } from './tweet.entity';

import { TweetService } from './tweets.services';

@Resolver(of=>tweetEntity)

export class TweetsResolver {
       
    constructor(private readonly tweetService:TweetService){}
        
   
    @Query(()=>[tweetEntity])
    async Tweets(){
        
        return this.tweetService.Tweets()
    }
    @Query(() => tweetEntity)
    async FindOneTweet(@Args({name:'id', type:()=>Int}) id:number){
        return this.tweetService.FindOneTweet(id);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Mutation(()=>String)

    async AddTweet(@CurrentUser() user, @Args('data') input: TweetInput){
    const userId = user.sub 
    this.tweetService.addTweet(input , userId)
    return "created"
    
    
    }
    @UseGuards(AuthGuard)
    @Mutation(()=>String)
    async RemoveTweet(@CurrentUser() user, @Args({name:'id' , type:()=>Int}) id:number){
        return this.tweetService.removeTweet(id , user.sub)
        

    }

}
