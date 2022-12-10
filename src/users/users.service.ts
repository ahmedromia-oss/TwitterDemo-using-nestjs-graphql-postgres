import { ExecutionContext,forwardRef, Inject, Injectable, NotAcceptableException, Scope, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { tweetEntity } from 'src/tweets/tweet.entity';
import { TweetsResolver } from 'src/tweets/tweets.resolver';
import { Repository } from 'typeorm';
import { User, UserInput } from './users.entity';
import * as bcrypt from 'bcrypt';
import { TweetService } from 'src/tweets/tweets.services';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly UserRepository:Repository<User>,
        @Inject(forwardRef(() => TweetService))
      

        private readonly tweetservice:TweetService,
        private jwtService: JwtService
    ){} 
    async Validate(Email:string ,password:string ){
        const user = await this.UserRepository.findOne({where:{Email:Email}})
        
    
       
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.PassWord)
        if (!user) {
            throw new NotAcceptableException('could not find the user');
        }
        if (user && passwordValid) {
            return user;
        }
        return null;
    }
    async login(user: User) {
        console.log(user)
        if(user == null){
            return "Bad Login Attempt"
        }
        const payload = { username: user.UserName, sub: user.id };
        return this.jwtService.sign(payload)
        
    }
    async SignIn(UserInput:UserInput){
        const username = await this.UserRepository.findOne({where:{UserName:UserInput.UserName}})
        const Email = await this.UserRepository.findOne({where:{Email:UserInput.Email}})
        

        if(Email != null){
            return "Email must be unique"
        }
        if(username != null) {
            return "UserName must be unique"
        }
        else{

        
        const hashedPassWord = await bcrypt.hash(UserInput.password , 12) 

        const user = await this.UserRepository.save(this.UserRepository.create({UserName:UserInput.UserName , Email:UserInput.Email , PassWord:hashedPassWord}))
        user.PassWord = hashedPassWord
        return "User Created Succefully"
        }
    }
    async Profile(id:number){
        
        return await this.UserRepository.findOne({
            relations:{
                tweets:true,
                LikedPosts:true,
                follower:true, 
                following:true
            },
            where:{id:id}
        })
    }
    async addOrRemoveLike(PostId:number , UserId:number){
        
        
        var user = await this.UserRepository.findOne({where:{id:UserId} , relations:{
            tweets:true,
            LikedPosts:true
        }})
        var Post = await this.tweetservice.FindOneTweet(PostId)
        var UserPost =  (await user.LikedPosts).find(post=>post.id == Post.id)
        if(Post == null){
            return "Post Not Found"
        }
        else{

        
        if(UserPost == undefined){
            ;(await user.LikedPosts).push(Post)
        await this.UserRepository.save(user)
        return "Like Added"
        }
        else{
            (await user.LikedPosts).splice((await user.LikedPosts).indexOf(UserPost))
        this.UserRepository.save(user)
        return "Like Removed"
        }

        }
        
    }
    async addOrRemoveFollow(followerId:number , followingId:number){
        
        if(followerId == followingId){
            return "You can't Follow Youself bro!"
        }
        else{
            var follower = await this.UserRepository.findOne({where:{id:followerId} , relations:{
                follower:true,
                following:true
            }})
            var following = await this.UserRepository.findOne({where:{id:followingId} ,
                relations:{
                    following:true,
                    follower:true
                } 
            })
            if(following == null){
                return "User Is Not Found"
            }
    
           else{

           
            var SearchFollowing = follower.following.find(Following=>Following.id == following.id)
            if(SearchFollowing == null){
                following.follower.push(follower) 
                this.UserRepository.save(follower)
                this.UserRepository.save(following)
                return "Follow Added"
            }
            else{
            following.follower.splice(following.follower.indexOf(SearchFollowing))
            this.UserRepository.save(follower)
            this.UserRepository.save(following)
            return "Follow Removed"
            }
        }
        }
        
        

    }
    
    
}
