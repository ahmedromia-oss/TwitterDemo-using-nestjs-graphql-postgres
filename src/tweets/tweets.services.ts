import { forwardRef, Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql";
import { User } from "src/users/users.entity";

import { UsersService } from "src/users/users.service";
import {  Repository } from "typeorm";
import { tweetEntity , TweetInput } from "./tweet.entity";


@Injectable()
export class TweetService {
   
    
    constructor( @InjectRepository(tweetEntity) private readonly TweetRepistory : Repository<tweetEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly UserService:UsersService
    
    ){

    }
    Tweets(){
        return this.TweetRepistory.find({relations:{
            user:true,
            likes:true,
            
        }})
    }
    async FindOneTweet(id:number):Promise<tweetEntity>{ 
        
        const tweet =  await this.TweetRepistory.findOne({
            relations:{
                
                user:true,
                likes:true,
                
            },
            where:{id:id}
        })
        if(tweet == null){
            throw new GraphQLError("No Such Tweet", {
                extensions: { code: 'NOT FOUND'},
              });
            
        }
        else{
            return tweet
        }
    }
    async addTweet(TweetInput:TweetInput , UserId:number){
    var user =await this.UserService.Profile(UserId)
    
    await this.TweetRepistory.save(this.TweetRepistory.create({content:TweetInput.content , user:user}))
        
        
    }
    async removeTweet(id:number , UserId:number){
    const user = this.UserService.Profile(UserId)
    if((await (await user).tweets).find(tweet=>tweet.id == id) != null)
    {
        this.TweetRepistory.delete(id) 
        return "Removed"
    }
    else{
        return "UnAuthorized"
    }        
    }
}
