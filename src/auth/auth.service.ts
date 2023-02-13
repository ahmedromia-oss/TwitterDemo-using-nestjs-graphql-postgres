import { forwardRef, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/Models/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor (
    @Inject (forwardRef(()=>UsersService)) 
    private readonly userServices:UsersService , 

    private jwtService: JwtService){}
    async Validate(Email:string ,password:string ){
        
        const user = await this.userServices.FindOneUser(Email)
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.PassWord)
        if (!user) {
            throw new NotAcceptableException('could not find the user');
        }
        if (user && passwordValid) {
        
            return user;
            
        }
        return null;
    }
    async login(user: User) {
        
        if(user == null){
            return "Bad Login Attempt"
        }
        const payload = { username: user.UserName, sub: user.id };
        return this.jwtService.sign(payload)
        
    }
}
