import { Field, InputType } from "@nestjs/graphql"
import { IsEmail , MaxLength , Validate , IsNotEmpty , MinLength} from "class-validator"
import { CheckIfEmpty } from "src/Validators/SpaceString.validator"

@InputType()
export class UserInput{

    @Field()
    @IsEmail()
    @MaxLength(50)
    @Validate(CheckIfEmpty)


    Email:string

    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(2)
    @Field()
    @Validate(CheckIfEmpty)


    UserName:string

    @MaxLength(18)
    @MinLength(8)
    @IsNotEmpty()
    @Field()
    @Validate(CheckIfEmpty)


    password:string

}