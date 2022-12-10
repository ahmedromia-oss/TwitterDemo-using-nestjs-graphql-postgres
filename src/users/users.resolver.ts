import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Query ,Args, Resolver, Mutation, Int } from '@nestjs/graphql';

// @ts-ignore
// import FileUpload from 'graphql-upload/Upload.js';
import { CurrentUser } from './decerators/currentUser.decerator';
import { AuthGuard } from './guards/auth.guard';
import { User, UserInput } from './users.entity';
import { UsersService } from './users.service';
import { createWriteStream } from 'fs';
import { UserLoginDTO } from './DTOs/UserLogin.DTO';
// import { GraphQLUpload } from "graphql-upload/GraphQLUpload.js";
// import { FileUpload } from "graphql-upload/Upload.js";


@Resolver(of=>(User))
export class UsersResolver {
    constructor(private readonly UserService:UsersService){}
    
    @UsePipes(ValidationPipe)
    @Mutation(()=>String)
    AddUser(@Args('data') input: UserInput){
        
        return this.UserService.SignIn(input)
        
    

    }
    @UsePipes(ValidationPipe)
    @Mutation(()=>String)
    async SignIn(@Args('data') user: UserLoginDTO){
        var token =await this.UserService.login(await this.UserService.Validate( user.Email, user.password))
        return token
        
    

    }
    @UseGuards(AuthGuard)
    @Query(() => User)
    async Profile(@CurrentUser() user, @Args({name:'id', type:()=>Int }) id:number){
        
        return this.UserService.Profile(user.sub);
    }

    // @Mutation(() => Boolean)
    // async uploadFile(@Args({name: 'file', type: () => GraphQLUpload})
    // {
    //     createReadStream,
    //     filename
    // }: FileUpload): Promise<boolean> {
    //     return new Promise(async (resolve, reject) => 
    //         createReadStream()
    //             .pipe(createWriteStream(`./uploads/${filename}`))
    //             .on('finish', () => resolve(true))
    //             .on('error', () => reject(false))
    //     );
    // }



    @UseGuards(AuthGuard)
    @Mutation( ()=>String)
    async addOrRemoveLike(@CurrentUser() user, @Args({name:'PostId', type:()=>Int})PostId:number){
       
        return this.UserService.addOrRemoveLike(PostId , user.sub)

         

    }
    @UseGuards(AuthGuard)
    @Mutation(()=>String)
    async AddOrRemoveFollw(@CurrentUser() user, @Args({name:'followingId', type:()=>Int}) followingId:number){
        
       return this.UserService.addOrRemoveFollow(user.sub , followingId)
       

    }
}
