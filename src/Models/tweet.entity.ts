import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/Models/users.entity";
import { Table, Column, Model  , PrimaryKey , BelongsTo , BelongsToMany, ForeignKey} from 'sequelize-typescript';
import { UserLikes } from "./UserLikes.Model";
import { UUID, UUIDV4} from "sequelize";




@Table
@ObjectType()
export class tweetEntity extends Model<tweetEntity>{
    @Field()
    @PrimaryKey
    @Column({type:UUID , defaultValue: UUIDV4,})

    id:string

    
    
    @Field()
    @Column
    content:string

    @ForeignKey(()=>User)
    @Column(UUID)
    userId:string


    @Field(()=>User)
    @BelongsTo(()=> User , "userId")
    user:User

    @Field(()=>[User])
    @BelongsToMany(()=>User , ()=>UserLikes)
    likes:User[]
}



