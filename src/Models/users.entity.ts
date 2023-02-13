import { Field, ObjectType } from "@nestjs/graphql";
import { tweetEntity } from "src/Models/tweet.entity";
import {Default , Table, Column, Model  , PrimaryKey , HasMany, BelongsToMany, Unique} from 'sequelize-typescript';
import { UserLikes } from "./UserLikes.Model";
import { FollowerFollowing } from "./FollowerFollowing.Model";
import { UUID, UUIDV4 } from "sequelize";




@Table

@ObjectType()
export class User extends Model<User>{
    @Field()
    @PrimaryKey
    
    @Column({type:UUID , defaultValue: UUIDV4,})
    id:string
    @Default(0)
    @Column
    @Field()
    followersNumber:number
    @Default(0)
    @Column
    @Field()
    
    followingNumber:number
         
    @Unique
    @Column
    @Field()
    Email:string
    @Column
    @Field()

    UserName:string
    @Field(()=>[tweetEntity])
    @HasMany(()=>tweetEntity)
    tweets:tweetEntity[]
    @Field()
    @Column
    PassWord:string


    @Field(()=>[tweetEntity])
    @BelongsToMany(()=>tweetEntity , ()=>UserLikes)
    
    LikedPosts:tweetEntity[]

    @Field(()=>[User])
    @BelongsToMany(()=>User , ()=>FollowerFollowing , "followingId" , "followerId")  
    followers:User[]

    @Field(()=>[User])
    @BelongsToMany(()=>User , ()=>FollowerFollowing   , "followerId" ,"followingId" )  

    followings:User[]

    @Default("DefaultImage.jpg")
    @Field()
    @Column

    ProfilePhoto:string
    @Default("DefaultImage.jpg")
    @Field()
    @Column

    CoverPhoto:string

    
    
    



    
    

}
