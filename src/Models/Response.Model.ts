import { Field, ObjectType } from "@nestjs/graphql";
import { tweetEntity } from "./tweet.entity";
import { User } from "./users.entity";



export interface ResponseModel<T>{   
    CODE:number   
    Message:string
}
@ObjectType()
export class MutationResponse<T> implements ResponseModel<T>{
    constructor(CODE:number , Message:string){
        this.CODE = CODE
        this.Message= Message
        
    }
    @Field()
    CODE: number;
    @Field()
    Message: string

}
@ObjectType()
export class TweetResponse<T> implements ResponseModel<T>{
    constructor(Message:string , CODE:number , data:T){
        this.Message = Message
        this.data = data
        this.CODE = CODE

    }
    @Field()
    CODE: number;
    @Field()
    Message: string;
    @Field(()=>[tweetEntity])
    data:T
    
  

}

@ObjectType()
export class UserResponse<T> implements ResponseModel<T>{
    constructor(Message:string , CODE:number , data:T){
        this.Message = Message
        this.data = data
        this.CODE = CODE

    }
    @Field()
    CODE: number;
    @Field()
    Message: string;
    @Field(()=>User)
    data:T
}

@ObjectType()
export class SingleTweetResponse<T> implements ResponseModel<T>{
    constructor(Message:string , CODE:number , data:T){
        this.Message = Message
        this.data = data
        this.CODE = CODE

    }
    @Field()
    CODE: number;
    @Field()
    Message: string;
    @Field(()=>tweetEntity)
    data:T
    
  

}