import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/sequelize';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @InjectConnection()
    private readonly sequelizeInstance: Sequelize,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    
    const req = ctx.getContext().req;
 


    const transaction: Transaction = await this.sequelizeInstance.transaction({
      logging: false,
    });
    
    req.transaction = transaction
    return next.handle().pipe(
      tap(async () => {
        await transaction.commit();
      
        
      }),
      catchError(async (err) => {
        await transaction.rollback();
        return err
        
      }),
    );
  }
}