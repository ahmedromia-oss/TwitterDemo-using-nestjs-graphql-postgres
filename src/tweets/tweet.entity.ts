import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {CheckIfEmpty} from "src/Validators/SpaceString.validator"

import { IsEmail, IsNotEmpty , MaxLength , MinLength  , Validate} from 'class-validator';



@Entity("tweets")
@ObjectType()
export class tweetEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id:number

    @Field()
    @Column()
    content:string

    @Field(()=>User)
    @ManyToOne(()=>User , user=>user.tweets , {onDelete:"CASCADE"})
    user:User

    @Field(()=>[User])
    @ManyToMany(()=>User , user=>user.LikedPosts , {onDelete:"CASCADE"})
    @JoinTable()
    likes:User[]
}

@InputType()
export class TweetInput{
    @Field()
    @Validate(CheckIfEmpty)
    @MaxLength(100)
    content:string
}

