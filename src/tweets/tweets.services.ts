import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    findAll(){
        return this.TweetRepistory.find({relations:{
            user:true
        }})
    }
    findByOne(id:number){ 
        
        return this.TweetRepistory.findOne({
            relations:{
                user:true
            },
            where:{id:id}
        })
    }
    async addTweet(TweetInput:TweetInput){
    var user =await this.UserService.findByOne(TweetInput.userId)
    
    await this.TweetRepistory.save(this.TweetRepistory.create({content:TweetInput.content , user:user}))
        
        
    }
    async removeTweet(id:number){
    
    this.TweetRepistory.delete(id) 
        
    
        
    }
}
