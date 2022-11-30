import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { tweetEntity } from "src/tweets/tweet.entity";


import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    

    
    

}
@InputType()
export class UserInput{

    @Field()
    Email:string

    @Field()

    UserName:string

}