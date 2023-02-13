import { User } from "src/Models/users.entity";
import { Table, Column, Model  , PrimaryKey , ForeignKey} from 'sequelize-typescript';

import { tweetEntity } from "./tweet.entity";
import { UUID, UUIDV4 } from "sequelize";




@Table
export class UserLikes extends Model<UserLikes>{
    @PrimaryKey
    @Column({type:UUID , defaultValue: UUIDV4,})
    id:string
    @ForeignKey(()=>User)
    @Column(UUID)
    userId:string

    @ForeignKey(()=>tweetEntity)
    @Column(UUID)
    tweetId:string

}