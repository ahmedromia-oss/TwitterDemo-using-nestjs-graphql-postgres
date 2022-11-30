import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { tweetEntity } from 'src/tweets/tweet.entity';
import { TweetsResolver } from 'src/tweets/tweets.resolver';
import { Repository } from 'typeorm';
import { User, UserInput } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly UserRepository:Repository<User>
    ){}
   async findAllUsers():Promise<User[]>{
        return await this.UserRepository.find({
            relations:{
                tweets:true
            }
        })

    }
    async AddUser(UserInput){
        await this.UserRepository.save(this.UserRepository.create(UserInput))
    

    }
    AddTweetUsers(user:User , tweet:tweetEntity){
        
      
    }
    async findByOne(id:number){
        
        return await this.UserRepository.findOne({
            relations:{
                tweets:true
            },
            where:{id:id}
        })
    }
    
    
}
