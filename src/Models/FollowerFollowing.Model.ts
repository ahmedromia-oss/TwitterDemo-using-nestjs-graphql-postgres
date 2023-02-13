import { ObjectType } from "@nestjs/graphql";
import { User } from "src/Models/users.entity";
import { Table, Column, Model  , PrimaryKey , ForeignKey} from 'sequelize-typescript';
import { UUID, UUIDV4 } from "sequelize";





@Table
@ObjectType()
export class FollowerFollowing extends Model<FollowerFollowing>{
    @PrimaryKey
    @Column({type:UUID , defaultValue: UUIDV4,})

    id:string
    @ForeignKey(()=>User)
    @Column(UUID)
    followingId:string
    
    @ForeignKey(()=>User)
    @Column(UUID)
    followerId:string
    
    

}