import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    @ManyToOne(()=>User , user=>user.tweets , {cascade:true})
    user:User
}
@InputType()
export class TweetInput{
    @Field()
    userId:number
    @Field()
    content:string
}

