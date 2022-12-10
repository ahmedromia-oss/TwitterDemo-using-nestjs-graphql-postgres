import { ValidationArguments, ValidationOptions, ValidatorConstraint , ValidatorConstraintInterface} from 'class-validator'

@ValidatorConstraint({async:true})
export class CheckIfEmpty implements ValidatorConstraintInterface{
    async validate(value:string){
        
      
          return !(value.trim().length === 0);
        }
      
        defaultMessage(args: ValidationArguments) {
          return "Please Insert Chrachters";
        }
    }
   



// export function IsEmpty(options?:ValidationOptions){}