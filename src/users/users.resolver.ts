import { Query ,Args, Resolver, Mutation, Int } from '@nestjs/graphql';
import { User, UserInput } from './users.entity';
import { UsersService } from './users.service';

@Resolver(of=>(User))
export class UsersResolver {
    constructor(private readonly UserService:UsersService){}
    @Query(()=>[User])
    async findAllUsers(){
        return await this.UserService.findAllUsers()
    }
    @Mutation(()=>String)
    AddUser(@Args('data') input: UserInput){
        this.UserService.AddUser(input)
        return "Created"

    }
    @Query(() => User)
    async FindUserByOne(@Args({name:'id', type:()=>Int}) id:number){
        return this.UserService.findByOne(id);
    }
    
}
