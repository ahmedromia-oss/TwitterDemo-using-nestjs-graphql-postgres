import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
;
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
 
import {  MutationResponse, ResponseModel, SingleTweetResponse, TweetResponse, UserResponse } from 'src/Models/Response.Model';
import { tweetEntity } from 'src/Models/tweet.entity';
import { User } from 'src/Models/users.entity';
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseModel<T>> {
      
      return next.handle().pipe(
        
        map<T , ResponseModel<T>>(data => {
        if(data instanceof User){
          return new UserResponse<T>( "Successfull" , 200,  data)
        }
        else if(data instanceof Array<tweetEntity>){
          return new TweetResponse<T>( "Successfull", 200, data)
        }
        else if(data instanceof tweetEntity){
          return new SingleTweetResponse<T>( "Successfull", 200, data)

        }
        else{
          if(data == "Created" || data == "Like added" || data == "follow added") 
          return new MutationResponse(201 , "Created")
          else if(data == "Removed" || data == "follow removed" || data == "Like removed"){
          return new MutationResponse(204 , "Removed")
          }
          else if(data == "Bad Request" ){
          return new MutationResponse(400 , "Bad Request")

          }
          else if(data == "UnAuthorized" ){
            return new MutationResponse(403 , "UnAuthorized")
          }

          }
         
        }
        )
      )
    }
  }
       
        
        
        
        
        
      
    

    