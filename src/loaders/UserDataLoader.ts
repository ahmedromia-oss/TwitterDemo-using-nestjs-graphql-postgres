import { User } from "src/Models/users.entity";
import * as DataLoader from 'dataloader'
import { tweetEntity } from "src/Models/tweet.entity";




export const generateUserDataLoader=()=>new DataLoader(
  async (keys: string[]):Promise<User[]> => {
        
      const tweet =await tweetEntity.findAll({where:{id:keys} , include:{model:User , as:'user'}})
      return tweet.map(tweet => tweet.user);
    })



    
