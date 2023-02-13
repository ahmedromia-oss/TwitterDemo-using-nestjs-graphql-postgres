import * as DataLoader from 'dataloader';
import { Request, Response } from 'express';
import { User } from 'src/Models/users.entity';


export interface MyContext {
  req: Request;
  res: Response;
  Userloader: DataLoader<string , User[]>
}