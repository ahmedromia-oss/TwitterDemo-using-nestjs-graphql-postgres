import { Resolver , Query, Args, Int, Mutation } from '@nestjs/graphql';
import { type } from 'os';
import { tweetEntity , TweetInput } from './tweet.entity';

import { TweetService } from './tweets.services';

@Resolver(of=>tweetEntity)

export class TweetsResolver {
       
    constructor(private readonly tweetService:TweetService){}
        
    
    @Query(()=>[tweetEntity])
    async findAll(){
        return this.tweetService.findAll()
    }
    @Query(() => tweetEntity)
    async FindByOne(@Args({name:'id', type:()=>Int}) id:number){
        return this.tweetService.findByOne(id);
    }
    @Mutation(()=>String)
    async AddTweet(@Args('data') input: TweetInput){
    this.tweetService.addTweet(input)
    return "created"
    
    
    }
    @Mutation(()=>String)
    async RemoveTweet(@Args({name:'id' , type:()=>Int}) id:number){
        this.tweetService.removeTweet(id)
        return "Removed"

    }

}
