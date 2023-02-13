import { Field, InputType } from "@nestjs/graphql";
import { Validate , MaxLength} from "class-validator";

import { CheckIfEmpty } from "src/Validators/SpaceString.validator";

@InputType()
export class TweetInput{
    
    @Field()
    @Validate(CheckIfEmpty)
    @MaxLength(100)
    
    

    content:string
}