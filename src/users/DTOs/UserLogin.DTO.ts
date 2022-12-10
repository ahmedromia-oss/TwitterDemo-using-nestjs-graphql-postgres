import { Field, InputType} from "@nestjs/graphql";

import {CheckIfEmpty} from "src/Validators/SpaceString.validator"
import { IsEmail, IsNotEmpty , MaxLength , MinLength  , Validate} from 'class-validator';


@InputType()
export class UserLoginDTO{

    @Field()
    @IsEmail()
    @Validate(CheckIfEmpty)
    Email:string

    
    @IsNotEmpty()
    @Field()
    @Validate(CheckIfEmpty)
    password:string

}