import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { tweetEntity } from 'src/Models/tweet.entity';
import { User} from '../Models/users.entity';
import * as bcrypt from 'bcrypt';
import { TweetService } from 'src/tweets/tweets.services';
import { AuthService } from 'src/auth/auth.service';
import { InjectModel } from '@nestjs/sequelize';
import { FollowerFollowing } from 'src/Models/FollowerFollowing.Model';
import { UserInput } from 'src/DTOs/User/UserRegisterDto';
import { Transaction, where } from 'sequelize';

import FileUpload = require('graphql-upload/GraphQLUpload.js');
import { createWriteStream } from 'fs';
import { MutationResponse } from 'src/Models/Response.Model';
const crypto = require('crypto');

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(FollowerFollowing)
        private followerfollowing: typeof FollowerFollowing,
        @InjectModel(User)
        private UserRepository: typeof User,
        @Inject(forwardRef(() => AuthService))
        private readonly authService:AuthService,
        @Inject(forwardRef(() => TweetService))
        private readonly tweetservice:TweetService,
        
    ){}
    getUUID = () =>
    (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (Number(c) ^ (crypto.randomBytes(1)[0] & (15 >> (Number(c) / 4)))).toString(16),
);


    async UpdateProfilePhoto({createReadStream,filename , mimetype}: FileUpload , userId:string , transaction:Transaction):Promise<boolean>{
        
        filename = this.getUUID()+filename
        const result =  new Promise<boolean>(async (resolve) =>{
        if(mimetype.split("/")[1] != "png" && mimetype.split("/")[1] != "jpeg" && mimetype.split("/")[1] != "jpg" ){
            filename = "/"
        } 
        return createReadStream()
            .pipe(createWriteStream("./uploads/" + filename))
            .on('finish', () => resolve(true))
            .on('error', () => resolve(false))
    }
    );      
    if(result){
        this.UserRepository.update({ProfilePhoto:filename} , {where:{id:userId} , transaction:transaction})
        return result
    }
    return result
    }

    async UpdateCoverPhoto({createReadStream,filename , mimetype}: FileUpload , userId:string , transaction:Transaction):Promise<boolean>{
        filename = this.getUUID()+filename
        const result =  new Promise<boolean>(async (resolve) =>{ 
        if(mimetype.split("/")[1] != "png" && mimetype.split("/")[1] != "jpeg" && mimetype.split("/")[1] != "jpg" ){
            filename = "/"
        } 
        return createReadStream()
            .pipe(createWriteStream("./uploads/"+ filename))
            .on('finish', () => resolve(true))
            .on('error', () => resolve(false))
        }
    );      
    if(result){
        this.UserRepository.update({CoverPhoto:filename} , {where:{id:userId} , transaction:transaction})
        return result
    }
    return result
    }
    async FindOneUser(Email:string):Promise<User>{
        const user = await this.UserRepository.findOne({where:{Email:Email}})
        return user
    }
    async Validate(Email:string ,password:string ){
        return this.authService.Validate(Email , password)
    }
    async login(user: User) {
        return this.authService.login(user)
        
    }
    async SignIn(UserInput:UserInput , transaction: Transaction){
        const username = await this.UserRepository.findOne({where:{UserName:UserInput.UserName}})
        const Email = await this.UserRepository.findOne({where:{Email:UserInput.Email}})
        

        if(Email != null){
            return new MutationResponse(400 , "Email Must be Unique")
        }
        if(username != null) {
            return new MutationResponse(400 , "UserName Must be Unique")
        }
        else{
            const hashedPassWord = await bcrypt.hash(UserInput.password , 12) 
            const user = await this.UserRepository.create({UserName:UserInput.UserName , Email:UserInput.Email , PassWord:hashedPassWord} , {transaction:transaction})

            user.PassWord = hashedPassWord
            
        }
        return new MutationResponse(200 , "Signed In Successfully")
    }
    async Profile(id:string){

        
        var result = await this.UserRepository.findOne({
            include:[{
                model:tweetEntity,
                as:"tweets",
            },
            {
                model:tweetEntity,
                as:"LikedPosts"
            },
            {
                model:User,
                as:"followings"
            },
            {
                model:User,
                as:"followers"
            }
        ],
    
            where:{id:id}
        }
        )
       return result
    }
    
    async addOrRemoveFollow(followerId:string , followingId:string , transaction:Transaction){
        var user:User
        try{
            user = await this.UserRepository.findOne(
                {where:{id:followingId}}
            )
            
        }
        catch{
            return "Bad Request"
        }
        
        
        if(followerId == followingId || user == null){
            
            return "Bad Request"
            
        }
        
        else{
            const result = await this.followerfollowing.findOne({where:{followingId:followingId , followerId:followerId}})
            
            if(result == null){
                await this.followerfollowing.create({followerId:followerId , followingId:followingId} , {transaction:transaction})
                const follower = this.UserRepository.findByPk(followerId)
                const following =  this.UserRepository.findByPk(followingId)
                await this.UserRepository.update({followersNumber:(await follower).followingNumber+1} , {where:{id:followingId} , transaction:transaction})
                await this.UserRepository.update({followingNumber:(await following).followersNumber+1} , {where:{id:followerId} , transaction:transaction})

              
            


                

                return "follow added"
            }
            else{
                await this.followerfollowing.destroy({where:{followerId:followerId , followingId:followingId} , transaction:transaction})
                const follower = this.UserRepository.findByPk(followerId)
                const following =  this.UserRepository.findByPk(followingId)
                await this.UserRepository.update({followersNumber:(await follower).followingNumber-1} , {where:{id:followingId} , transaction:transaction})
                await this.UserRepository.update({followingNumber:(await following).followersNumber-1} , {where:{id:followerId} , transaction:transaction})
                

                
                return "follow removed"
            }
        }
}
    
    
}
