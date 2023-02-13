import { forwardRef, Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { GraphQLError } from "graphql";
import { UserLikes } from "src/Models/UserLikes.Model";
import { User } from "src/Models/users.entity";
import { UsersService } from "src/users/users.service";
import { tweetEntity } from "../Models/tweet.entity";
import { TweetInput } from "src/DTOs/Tweet/AddTweetDTO";
import { Transaction } from "sequelize";
import { FetchTweetArgs } from "src/Models/FetchTweetArgs";


@Injectable()
export class TweetService {
   
    
    constructor( 
        @InjectModel(UserLikes)
        private userLikes: typeof UserLikes,
        @InjectModel(tweetEntity)
        private TweetRepistory: typeof tweetEntity,
        @Inject(forwardRef(() => UsersService))
    private readonly UserService:UsersService
    
    ){

    }
    
            
       
    async Tweets(args:FetchTweetArgs={skip:0 , take:5}){
        
        return  (await this.TweetRepistory.findAll({
            limit:args.take,
            offset:args.skip,
            
            include:[{
            model:User,
            as:"likes",
        },
        {
            model:User,
            as:"user"
        }
    ]}))
    
    }
    async FindOneTweet(id:string):Promise<tweetEntity>{ 
        var tweet:tweetEntity
        try{
        tweet =  await this.TweetRepistory.findByPk(id , {include:[
            {
                model:User,
                as:"likes"
            },
            {
                model:User,
                as:"user"
            }
        ]
   
            
        })
        
    }
    catch{
        throw new GraphQLError("No Such Tweet", {
            extensions: { code: 'NOT FOUND'},
          });
    }
    if(tweet == null){
        throw new GraphQLError("No Such Tweet", {
            extensions: { code: 'NOT FOUND'},
          });
    }
    return tweet
    }
    async addTweet(TweetInput:TweetInput , UserId:string , transaction:Transaction){
    var user =await this.UserService.Profile(UserId)
    
    await this.TweetRepistory.create({content:TweetInput.content , userId:user.id} , {transaction:transaction})

    
   

    
        
        
    }
    async removeTweet(id:string , UserId:string){
    const user = this.UserService.Profile(UserId)
    if( (await user).tweets.find(tweet=>tweet.id == id) != null)
    {
        this.TweetRepistory.destroy({where:{id:id}}) 
        return "Removed"
    }
    else{
        return "UnAuthorized"
    }

    }
    async addOrRemoveLike(PostId:string , UserId:string , transaction:Transaction){
        var post:tweetEntity
        try{
           post = await this.TweetRepistory.findByPk(PostId)
        }
        catch{
            return "Bad Request"
         }
        if(post == null){
            return "Bad Request"
        }
        const result = await this.userLikes.findOne({where:{userId:UserId , tweetId:PostId}})
        
        
        
        if(result != null){

            await this.userLikes.destroy({where:{userId:result.userId ,tweetId:result.tweetId}})
            return "Like removed"
        }
        else{
        
        await this.userLikes.create({userId:UserId , tweetId:PostId} , {transaction:transaction})
            return "Like added"
        }
        }
   
       
    
    } 
    

