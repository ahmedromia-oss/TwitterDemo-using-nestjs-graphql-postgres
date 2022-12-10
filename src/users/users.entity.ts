import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { tweetEntity } from "src/tweets/tweet.entity";
import {CheckIfEmpty} from "src/Validators/SpaceString.validator"
import { IsEmail, IsNotEmpty , MaxLength , MinLength  , Validate} from 'class-validator';


import { Column, Entity ,JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";


@Entity('users')
@ObjectType()
export class User{
    @Field()
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    @Field()
    Email:string
    @Column()
    @Field()

    UserName:string
    @Field(()=>[tweetEntity])
    @OneToMany(()=>tweetEntity , tweets=>tweets.user)
    
    tweets:Promise<tweetEntity[]>
    @Field()
    @Column()
    PassWord:string

    @Field(()=>[User])


    

    @Field(()=>[tweetEntity])
    @ManyToMany(()=>tweetEntity , tweetEntity=>tweetEntity.likes , {onDelete:"CASCADE"})
    @JoinTable()
    LikedPosts:tweetEntity[]

    @Field(()=>[User])
    @ManyToMany(()=>User , user=>user.follower)
    
    following:User[]

    @Field(()=>[User])
    @ManyToMany(()=>User , user=>user.following)
    @JoinTable()
    follower:User[]
    
    
    



    
    

}
@InputType()
export class UserInput{

    @Field()
    @IsEmail()
    @MaxLength(50)
    @Validate(CheckIfEmpty)


    Email:string

    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(2)
    @Field()
    @Validate(CheckIfEmpty)


    UserName:string

    @MaxLength(18)
    @MinLength(8)
    @IsNotEmpty()
    @Field()
    @Validate(CheckIfEmpty)


    password:string

}