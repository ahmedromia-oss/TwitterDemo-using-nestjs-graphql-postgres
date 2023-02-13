import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';

@Injectable()
export class AuthGuard implements CanActivate {
constructor(private readonly jwtService:JwtService){}
canActivate(context: ExecutionContext): boolean {
    
    const ctx = GqlExecutionContext.create(context)
    const request:IncomingMessage & { user?: Record<string, unknown> } = ctx.getContext().req
   
    
    try {
    
        
  
    const authorization = request.headers["authorization"]
  
    
    const token = authorization
    
    const user = this.jwtService.verify(token);
        request.user = user;
      
        return true;
      } catch (e) {
      
        console.log(e)
        // return false or throw a specific error if desired
        return false;
      }
  }
}